#!/usr/bin/env python3
"""Empaqueta los assets del GitHub Release (con espejo en Drive).

Genera en dist/:
  weights_demo.zip           pesos entrenados de las 4 familias (ruta A del README)
  experiments_artifacts.zip  metricas + predicciones de test (ruta B: regenerar tablas)
  gold_coco_gt.zip           ground-truths de evaluacion (atajo de la ruta B)
  release_manifest.json      tamanos y SHA-256 de todo

Uso:  python3 scripts/empaquetar_release.py
Idempotente: sobrescribe los zips. Ejecutar de nuevo tras cerrar mas experimentos
anade lo nuevo automaticamente.
"""
import json
import hashlib
import zipfile
import datetime
from pathlib import Path

CODE = Path(__file__).resolve().parent.parent
P0, P1 = CODE / "experiments" / "p0", CODE / "experiments" / "p1"
GOLD = CODE / "data" / "gold"
DIST = CODE / "dist"
DIST.mkdir(exist_ok=True)


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for blk in iter(lambda: f.read(1 << 20), b""):
            h.update(blk)
    return h.hexdigest()


def zipear(destino, pares):
    """pares: [(ruta_absoluta, ruta_dentro_del_zip)]"""
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        for src, arc in pares:
            z.write(src, arc)
    return destino


# ── 1 · weights_demo.zip ─────────────────────────────────────────────────────
# VGG y FCN pesan cientos de MB por checkpoint y la demo usa el mejor de cada
# familia: se incluye SOLO el mejor E y el mejor D (por metrica de validacion).
# Los detectores (FRCNN, YOLO) se incluyen todos: la demo permite elegirlos y
# su costo es razonable.
def _mejor_por_metrica(runs, exps, metrica):
    mejor, mejor_v = None, None
    for e in exps:
        p = runs / e / "DONE.json"
        if not p.exists() or not (runs / e / "mejor.pt").exists():
            continue
        v = json.loads(p.read_text()).get("mejor", {}).get(metrica)
        if v is not None and (mejor is None or v > mejor_v):
            mejor, mejor_v = e, v
    return mejor


pares_w = []
seleccion_p0 = [_mejor_por_metrica(P0, ["E1", "E2", "E3", "E4"], "val_acc"),
                _mejor_por_metrica(P0, ["D1", "D2"], "val_iou"),
                "A1", "A2", "B6", "B5", "C"]
for nombre_exp in seleccion_p0:
    if not nombre_exp:
        continue
    exp_dir = P0 / nombre_exp
    p = exp_dir / "mejor.pt"
    if p.exists() and (exp_dir / "DONE.json").exists():
        pares_w.append((p, f"p0/{exp_dir.name}/mejor.pt"))
        pares_w.append((exp_dir / "DONE.json", f"p0/{exp_dir.name}/DONE.json"))
for exp_dir in sorted(P1.glob("*/")):
    p = exp_dir / "ultra" / "train" / "weights" / "best.pt"
    if p.exists() and (exp_dir / "DONE.json").exists():
        pares_w.append((p, f"p1/{exp_dir.name}/ultra/train/weights/best.pt"))
        pares_w.append((exp_dir / "DONE.json", f"p1/{exp_dir.name}/DONE.json"))

# ── 2 · experiments_artifacts.zip (sin pesos: solo metricas y predicciones) ──
pares_a = []
for runs, fase in ((P0, "p0"), (P1, "p1")):
    if not runs.exists():
        continue
    for p in sorted(runs.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(runs)
        if p.name in ("DONE.json", "FAILED.json", "log.txt") \
           or p.name.startswith(("preds_", "predicciones_")) \
           or (p.parent == runs and p.suffix == ".json"):
            pares_a.append((p, f"{fase}/{rel}"))

# ── 3 · gold_coco_gt.zip ─────────────────────────────────────────────────────
pares_g = [(p, f"coco/{p.name}") for p in sorted((GOLD / "coco").glob("*.json"))] \
          if (GOLD / "coco").exists() else []

manifest = {"generado": datetime.datetime.now().isoformat(timespec="seconds"),
            "assets": {}}
for nombre, pares in (("weights_demo.zip", pares_w),
                      ("experiments_artifacts.zip", pares_a),
                      ("gold_coco_gt.zip", pares_g)):
    if not pares:
        print(f"  {nombre}: sin contenido aun - omitido")
        continue
    destino = zipear(DIST / nombre, pares)
    mb = destino.stat().st_size / 1e6
    manifest["assets"][nombre] = {"archivos": len(pares), "mb": round(mb, 1),
                                  "sha256": sha256(destino)}
    print(f"  {nombre}: {len(pares)} archivos, {mb:,.1f} MB")

(DIST / "release_manifest.json").write_text(json.dumps(manifest, indent=2))
print("\nmanifiesto -> dist/release_manifest.json")
print("Subir los zips como assets del GitHub Release; copiar el mismo juego a Drive "
      "como espejo y enlazar ambos en las notas del Release.")
