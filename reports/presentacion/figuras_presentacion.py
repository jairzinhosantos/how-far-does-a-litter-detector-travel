#!/usr/bin/env python3
"""Figuras de la presentación con la paleta institucional UNI + acentos tipo Google.

Regenera, desde los mismos artefactos del proyecto, versiones de las figuras con
la paleta de la presentación. No toca las figuras del paper ni del póster.

Salida: reports/presentacion/assets/*.png
Uso:    <python del proyecto> reports/presentacion/figuras_presentacion.py
"""
import contextlib
import io as _io
import json
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent
CODE = AQUI.parent.parent
OUT = AQUI / "assets"
OUT.mkdir(parents=True, exist_ok=True)
RUNS_P1 = CODE / "experiments" / "p1"
TAB = CODE / "reports" / "tablas"

# ── paleta: granate UNI + acentos Google desaturados + grises Google ──────────
GRANATE = "#800404"
AZUL = "#3B6FD4"; ROJO = "#D64A3F"; AMBAR = "#E9A825"; VERDE = "#2E9E5B"
INK = "#202124"; GRIS = "#5F6368"; GRIS2 = "#9AA0A6"; REJILLA = "#E8EAED"
BG = "#FFFFFF"
DOM = {"taco": AZUL, "rolid": AMBAR, "uav": VERDE,
       "rolid11k": AMBAR, "uavvaste": VERDE}

plt.rcParams.update({
    "figure.dpi": 110, "savefig.dpi": 200,
    "figure.facecolor": BG, "savefig.facecolor": BG, "axes.facecolor": BG,
    "axes.edgecolor": REJILLA, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "axes.axisbelow": True, "grid.color": REJILLA,
    "axes.titlesize": 12, "axes.titleweight": "bold", "axes.titlecolor": INK,
    "axes.labelsize": 10, "axes.labelcolor": GRIS,
    "xtick.labelsize": 9, "ytick.labelsize": 9,
    "xtick.color": GRIS, "ytick.color": GRIS,
    "xtick.major.size": 0, "ytick.major.size": 0,
    "legend.fontsize": 9, "legend.frameon": False,
    "font.family": "sans-serif", "font.size": 10,
})
CMAP = LinearSegmentedColormap.from_list("uni", ["#FFFFFF", "#F4D9C4", AMBAR, ROJO, GRANATE])


def guardar(fig, nombre):
    fig.tight_layout()
    fig.savefig(OUT / f"{nombre}.png", bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(" ", nombre + ".png")


# ── 1 · matriz cross-domain ──────────────────────────────────────────────────
det = json.loads((RUNS_P1 / "matriz_cross_domain.json").read_text())
doms = ["taco", "rolid", "uav"]
etq = {"taco": "TACO\n(mano)", "rolid": "RoLID\n(dashcam)", "uav": "UAVVaste\n(dron)"}
M = pd.DataFrame(index=doms, columns=doms, dtype=float)
Ms = pd.DataFrame(index=doms, columns=doms, dtype=float)
for k, v in det.items():
    a, b = k.split("->")
    M.loc[a, b] = v["ap50"]; Ms.loc[a, b] = v.get("ap_s", np.nan)

for datos, nombre, titulo in ((M, "p_matriz_ap50", "AP$_{50}$ cross-domain (YOLOv11n @640)"),
                              (Ms, "p_matriz_aps", "AP$_{small}$ cross-domain")):
    fig, ax = plt.subplots(figsize=(5.6, 4.6))
    vals = datos.values.astype(float)
    ax.imshow(vals, cmap=CMAP, vmin=0, vmax=max(0.8, np.nanmax(vals)))
    ax.set_xticks(range(3)); ax.set_xticklabels([etq[c] for c in doms], fontsize=9)
    ax.set_yticks(range(3)); ax.set_yticklabels([etq[c] for c in doms], fontsize=9)
    ax.set_xlabel("evaluado en  →", fontweight="bold")
    ax.set_ylabel("entrenado en  →", fontweight="bold")
    for i in range(3):
        for j in range(3):
            v = vals[i, j]
            ax.text(j, i, f"{v:.3f}", ha="center", va="center", fontsize=13,
                    fontweight="bold" if i == j else "normal",
                    color="white" if v > 0.45 else INK)
    for i in range(3):
        ax.add_patch(plt.Rectangle((i - .5, i - .5), 1, 1, fill=False,
                                   edgecolor=INK, lw=2.2, zorder=5))
    ax.set_title(titulo, loc="left")
    ax.grid(False)
    guardar(fig, nombre)

# ── 2 · fuga oficial vs por video ────────────────────────────────────────────
d = json.loads((RUNS_P1 / "oficial_vs_video.json").read_text())
df = pd.DataFrame(d).T
vals = df["AP50"].astype(float).tolist()
fig, ax = plt.subplots(figsize=(7.0, 4.0))
cols = [GRIS2, VERDE, ROJO]
etiq = ["Entrenado con el split oficial\nevaluado en su test oficial",
        "Entrenado por video (limpio)\nevaluado en el test limpio",
        "Entrenado con el split oficial\nevaluado en el test limpio"]
b = ax.bar(range(3), vals, color=cols, width=0.6, zorder=3)
for x, v in enumerate(vals):
    ax.text(x, v + 0.015, f"{v:.3f}", ha="center", fontsize=14, fontweight="bold", color=INK)
ax.set_xticks(range(3)); ax.set_xticklabels(etiq, fontsize=8.5)
ax.set_ylabel("AP$_{50}$ (test)")
ax.set_ylim(0, max(vals) * 1.22)
ax.annotate("", xy=(2, vals[2] + 0.005), xytext=(1, vals[1] + 0.005),
            arrowprops=dict(arrowstyle="<->", color=ROJO, lw=1.8))
ax.text(1.5, max(vals) * 1.08, f"+{(vals[2]-vals[1]):.3f}  (+21 %)",
        ha="center", fontsize=12, fontweight="bold", color=ROJO)
ax.set_title("Mismo conjunto de evaluación, dos formas de partir los datos", loc="left")
guardar(fig, "p_fuga")

# ── 3 · ablación de resolución ───────────────────────────────────────────────
df = pd.DataFrame(json.loads((RUNS_P1 / "ablacion_resolucion.json").read_text())).T
fig, axes = plt.subplots(1, 2, figsize=(9.5, 3.0), sharey=True)
for ax, (c640, c1024, t) in zip(axes, (("AP50@640", "AP50@1024", "AP$_{50}$"),
                                       ("AP_s@640", "AP_s@1024", "AP$_{small}$"))):
    for y, (ds, fila) in enumerate(df.iterrows()):
        col = DOM.get(ds, GRIS)
        a, b_ = float(fila[c640]), float(fila[c1024])
        ax.plot([a, b_], [y, y], color=col, lw=2.5, zorder=3)
        ax.scatter([a], [y], s=90, color=BG, edgecolor=col, lw=2.5, zorder=4)
        ax.scatter([b_], [y], s=110, color=col, zorder=4)
        ax.text(b_ + 0.018, y + 0.16, f"+{b_-a:.3f}", va="center", fontsize=10,
                color=col, fontweight="bold")
    ax.set_yticks(range(len(df)))
    ax.set_yticklabels([{"taco": "TACO (mano)", "rolid": "RoLID (dashcam)"}.get(i, i)
                        for i in df.index], fontsize=10)
    ax.set_title(t + "   ○ 640 px   ● 1024 px", loc="left", fontsize=11)
    ax.set_xlim(left=0); ax.margins(x=0.18, y=0.35)
guardar(fig, "p_ablacion")

# ── 4 · comparativa de familias ──────────────────────────────────────────────
comp = pd.read_csv(TAB / "comparativa_familias.csv")
piv = comp.pivot_table(index="datos", columns="familia", values="test_AP50")
orden = ["rolid_video_1cls", "taco_1cls", "taco_6cls", "taco_5cls"]
piv = piv.reindex([o for o in orden if o in piv.index])
nombres = {"rolid_video_1cls": "RoLID\n1 clase", "taco_1cls": "TACO\n1 clase",
           "taco_6cls": "TACO\n6 clases", "taco_5cls": "TACO\n5 clases"}
x = np.arange(len(piv)); w = 0.36
fig, ax = plt.subplots(figsize=(8.0, 3.8))
ax.bar(x - w/2, piv["FRCNN"], w, color=AZUL, label="Faster R-CNN  ·  41.3 M parámetros", zorder=3)
ax.bar(x + w/2, piv["YOLO"], w, color=AMBAR, label="YOLOv11n  ·  2.6 M parámetros", zorder=3)
for xi, v in zip(x - w/2, piv["FRCNN"]):
    ax.text(xi, v + 0.008, f"{v:.3f}", ha="center", fontsize=9.5, color=INK)
for xi, v in zip(x + w/2, piv["YOLO"]):
    ax.text(xi, v + 0.008, f"{v:.3f}", ha="center", fontsize=9.5, color=INK)
ax.set_xticks(x); ax.set_xticklabels([nombres.get(i, i) for i in piv.index], fontsize=10)
ax.set_ylabel("AP$_{50}$ (test)"); ax.set_ylim(0, 0.82)
ax.legend(loc="upper right")
ax.set_title("Mismos datos, mismos splits, misma vara", loc="left")
guardar(fig, "p_familias")

# ── 5 · TIDE ─────────────────────────────────────────────────────────────────
tdf = pd.read_csv(TAB / "tide_errores.csv").set_index("modelo")
tipos = [t for t in ("Cls", "Loc", "Both", "Dupe", "Bkg", "Miss") if t in tdf.columns]
col_err = {"Cls": AZUL, "Loc": "#8AB4F8", "Both": "#C58AF9",
           "Dupe": GRIS2, "Bkg": AMBAR, "Miss": ROJO}
nombres_t = {"Cls": "Clasificación", "Loc": "Localización", "Both": "Ambos",
             "Dupe": "Duplicado", "Bkg": "Fondo (falso +)", "Miss": "No detectado"}
dfp = tdf[tipos].fillna(0).iloc[::-1]
etiquetas = [i.replace("P0-FRCNN-", "FRCNN ").replace("P1-YOLO-", "YOLO ") for i in dfp.index]
fig, ax = plt.subplots(figsize=(8.6, 4.6))
izq = np.zeros(len(dfp))
for tp in tipos:
    ax.barh(etiquetas, dfp[tp], left=izq, color=col_err[tp], label=nombres_t[tp], zorder=3)
    izq += dfp[tp].values
ax.set_xlabel("dAP · puntos de AP que se recuperarían al corregir ese tipo de error")
ax.legend(ncol=3, loc="upper center", bbox_to_anchor=(0.5, -0.14))
ax.set_title("Anatomía del error por modelo", loc="left")
guardar(fig, "p_tide")

# ── 6 · escala de objetos ────────────────────────────────────────────────────
an = pd.read_parquet(CODE / "data" / "_eda" / "anotaciones.parquet",
                     columns=["dataset", "lado_equiv", "invalida"])
an = an[(~an["invalida"]) & an["dataset"].isin(["taco", "rolid11k", "uavvaste"])]
et = {"taco": "TACO (mano) · mediana 171 px",
      "rolid11k": "RoLID-11K (dashcam) · mediana 22 px",
      "uavvaste": "UAVVaste (dron) · mediana 72 px"}
fig, ax = plt.subplots(figsize=(6.6, 3.8))
for ds in ("taco", "uavvaste", "rolid11k"):
    v = np.sort(an.loc[an["dataset"] == ds, "lado_equiv"].to_numpy())
    ax.plot(v, np.arange(1, len(v) + 1) / len(v), color=DOM[ds], lw=2.5,
            label=et[ds], zorder=3)
ax.axvspan(4, 32, color=ROJO, alpha=0.07, zorder=1)
ax.axvline(32, color=ROJO, lw=1.6, ls="--", zorder=2)
ax.text(33, 0.9, "ancla FPN más pequeña\n32 px", fontsize=9, color=ROJO, fontweight="bold")
ax.text(5.2, 0.62, "por debajo de\nlo que el modelo\npuede ver", fontsize=8.5, color=ROJO)
ax.set_xscale("log"); ax.set_xlim(4, 1500); ax.set_ylim(0, 1)
ax.set_xlabel("lado del objeto (px, escala logarítmica)")
ax.set_ylabel("fracción acumulada de objetos")
ax.legend(loc="lower right", fontsize=8.5)
ax.set_title("La escala del objeto separa los dominios", loc="left")
guardar(fig, "p_escala")

# ── 7 · curvas de entrenamiento ──────────────────────────────────────────────
CFG_COL = {"F1": AZUL, "F2": AMBAR, "F3": "#F0C86B", "F4": VERDE,
           "G1": "#8AB4F8", "G2": "#5B8DEF", "H1": GRANATE, "H2": ROJO}
fig, ax = plt.subplots(figsize=(8.6, 4.0))
for e in ("F1", "F2", "F3", "F4", "G1", "G2", "H1", "H2"):
    p = RUNS_P1 / e / "DONE.json"
    if not p.exists():
        continue
    m = json.loads(p.read_text())
    va = m.get("hist", {}).get("va_ap50", [])
    if va:
        cfg = m["config"]
        ax.plot(va, lw=1.8, color=CFG_COL.get(e, GRIS),
                label=f"{e} · {cfg['gold'].replace('_1cls','').replace('_',' ')} @{cfg['imgsz']}")
ax.set_xlabel("época"); ax.set_ylabel("AP$_{50}$ de validación")
ax.legend(fontsize=8, ncol=2, loc="lower right")
ax.set_title("Las 8 corridas YOLO: convergencia y early stopping", loc="left")
guardar(fig, "p_curvas")

# ── 8 · curva precisión-recall real ──────────────────────────────────────────
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval
with contextlib.redirect_stdout(_io.StringIO()):
    gt = COCO(str(CODE / "data/gold/coco/rolid_video_1cls_test.json"))
    dt = gt.loadRes(json.loads((RUNS_P1 / "F2/preds_rolid_video_1cls_test.json").read_text()))
    ev = COCOeval(gt, dt, "bbox"); ev.evaluate(); ev.accumulate()
prec = ev.eval["precision"][0, :, 0, 0, -1]
rec = ev.params.recThrs
fig, ax = plt.subplots(figsize=(6.4, 4.2))
ax.plot(rec, prec, color=AZUL, lw=3, zorder=3)
ax.fill_between(rec, prec, color=AZUL, alpha=0.18, zorder=2)
ax.set_xlabel("Recall  →  ¿cuánto de lo que había encontré?")
ax.set_ylabel("Precisión  →  ¿cuánto de lo que dije era cierto?")
ax.set_xlim(0, 1); ax.set_ylim(0, 1.02)
ap = float(prec[prec > -1].mean())
ax.text(0.26, 0.44, f"AP = área bajo la curva\n= {ap:.3f}", fontsize=15,
        fontweight="bold", color=INK)
ax.annotate("umbral alto: pocas\ndetecciones, casi\ntodas ciertas", xy=(0.06, 0.98),
            xytext=(0.03, 0.66), fontsize=8.5, color=GRIS,
            arrowprops=dict(arrowstyle="->", color=GRIS2))
ax.annotate("umbral bajo: encuentra\nmás pero inventa más", xy=(0.83, 0.28),
            xytext=(0.30, 0.13), fontsize=8.5, color=GRIS,
            arrowprops=dict(arrowstyle="->", color=GRIS2))
ax.set_title("Curva precisión-recall real (YOLOv11n · test RoLID · IoU 0.5)", loc="left")
guardar(fig, "p_pr")

# ── 9 · TP / FP / FN sobre imagen real ───────────────────────────────────────
from ultralytics import YOLO
with contextlib.redirect_stdout(_io.StringIO()):
    gtt = COCO(str(CODE / "data/gold/coco/taco_1cls_test.json"))
yolo = YOLO(str(RUNS_P1 / "F1/ultra/train/weights/best.pt"))


def iou(a, b):
    ax1, ay1, ax2, ay2 = a; bx1, by1, bw, bh = b
    bx2, by2 = bx1 + bw, by1 + bh
    ix = max(0, min(ax2, bx2) - max(ax1, bx1)); iy = max(0, min(ay2, by2) - max(ay1, by1))
    inter = ix * iy; ua = (ax2 - ax1) * (ay2 - ay1) + bw * bh - inter
    return inter / ua if ua > 0 else 0


info = next(i for i in gtt.dataset["images"] if i["file_name"].endswith("batch_13__000016.jpg"))
anns = gtt.loadAnns(gtt.getAnnIds(imgIds=[info["id"]]))
ruta = CODE / "data/gold" / info["file_name"]
r = yolo.predict(str(ruta), imgsz=640, conf=0.20, device="cpu", verbose=False)[0]
preds = [(tuple(b.tolist()), float(s)) for b, s in zip(r.boxes.xyxy.cpu(), r.boxes.conf.cpu())]
usadas, tp, fp = set(), [], []
for caja, sc in sorted(preds, key=lambda x: -x[1]):
    m, mi = 0, None
    for j, a in enumerate(anns):
        if j in usadas: continue
        v = iou(caja, a["bbox"])
        if v > m: m, mi = v, j
    (tp.append(caja), usadas.add(mi)) if m >= 0.5 else fp.append(caja)
fn = [a["bbox"] for j, a in enumerate(anns) if j not in usadas]
im = Image.open(ruta).convert("RGB")
d = ImageDraw.Draw(im)
g = max(4, int(min(im.size) / 150))
for x1, y1, x2, y2 in tp: d.rectangle([x1, y1, x2, y2], outline=VERDE, width=g)
for x1, y1, x2, y2 in fp: d.rectangle([x1, y1, x2, y2], outline=AMBAR, width=g)
for x, y, w_, h_ in fn: d.rectangle([x, y, x + w_, y + h_], outline=ROJO, width=g)
im.save(OUT / "p_tpfpfn.png")
print("  p_tpfpfn.png ·", f"TP={len(tp)} FP={len(fp)} FN={len(fn)}")
print("listo")
