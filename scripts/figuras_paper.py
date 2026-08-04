#!/usr/bin/env python3
"""Figuras de apoyo del paper (ES/EN) derivadas de artefactos ya generados.

Produce en reports/figuras_final/:
  escala_objetos.png / _en.png   CDF del lado del objeto por dominio (EDA parquet)
  p1_curvas_en.png               curvas de val AP50 por epoca (DONE.json de P1)
  cam_panel_paper.png            version compacta 3x3 del panel CAM de la 04
                                 (una fila por dominio; se omite la columna
                                 Guided x CAM, defectuosa en el panel original)

Uso:  <python del proyecto> scripts/figuras_paper.py
Idempotente: sobrescribe las cuatro figuras.
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

CODE = Path(__file__).resolve().parent.parent
FIG = CODE / "reports" / "figuras_final"
FIG.mkdir(parents=True, exist_ok=True)

SUPERFICIE = "#fcfcfb"; TINTA_1 = "#1a1a19"; TINTA_2 = "#52514e"
REJILLA = "#e6e5e0"
PAL = {"taco": "#2a78d6", "rolid11k": "#eb6834", "uavvaste": "#1baf7a"}
plt.rcParams.update({
    "figure.dpi": 110, "savefig.dpi": 170,
    "figure.facecolor": SUPERFICIE, "savefig.facecolor": SUPERFICIE,
    "axes.facecolor": SUPERFICIE, "axes.edgecolor": REJILLA,
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "axes.axisbelow": True, "grid.color": REJILLA,
    "axes.titlesize": 11, "axes.titleweight": "bold", "axes.titlecolor": TINTA_1,
    "axes.labelsize": 9, "axes.labelcolor": TINTA_2,
    "xtick.labelsize": 8, "ytick.labelsize": 8,
    "xtick.color": TINTA_2, "ytick.color": TINTA_2,
    "legend.fontsize": 8, "legend.frameon": False,
    "font.family": "sans-serif", "font.size": 9,
})

# ── 1 · CDF de escala del objeto (ES + EN) ───────────────────────────────────
TXT = {
    "es": {"x": "lado equivalente del objeto (px, escala log)",
           "y": "fracción acumulada de objetos",
           "t": "La escala del objeto separa los dominios",
           "ancla": "ancla FPN mínima (32 px)",
           "et": {"taco": "TACO (mano) · mediana 171 px",
                  "rolid11k": "RoLID-11K (dashcam) · mediana 22 px",
                  "uavvaste": "UAVVaste (dron) · mediana 72 px"}},
    "en": {"x": "equivalent object side (px, log scale)",
           "y": "cumulative fraction of objects",
           "t": "Object scale separates the domains",
           "ancla": "smallest FPN anchor (32 px)",
           "et": {"taco": "TACO (handheld) · median 171 px",
                  "rolid11k": "RoLID-11K (dashcam) · median 22 px",
                  "uavvaste": "UAVVaste (drone) · median 72 px"}},
}

df = pd.read_parquet(CODE / "data" / "_eda" / "anotaciones.parquet",
                     columns=["dataset", "lado_equiv", "invalida"])
df = df[(~df["invalida"]) & df["dataset"].isin(PAL)]

for idioma, sufijo in (("es", ""), ("en", "_en")):
    t = TXT[idioma]
    fig, ax = plt.subplots(figsize=(5.4, 3.2))
    for ds in ("taco", "uavvaste", "rolid11k"):
        v = np.sort(df.loc[df["dataset"] == ds, "lado_equiv"].to_numpy())
        ax.plot(v, np.arange(1, len(v) + 1) / len(v), color=PAL[ds],
                lw=2, label=t["et"][ds], zorder=3)
    ax.axvline(32, color=TINTA_1, lw=1.2, ls="--")
    ax.text(34, 0.04, t["ancla"], fontsize=7.5, color=TINTA_1)
    ax.set_xscale("log")
    ax.set_xlim(4, 1500); ax.set_ylim(0, 1)
    ax.set_xlabel(t["x"]); ax.set_ylabel(t["y"])
    ax.set_title(t["t"], loc="left")
    ax.legend(loc="lower right")
    fig.tight_layout()
    fig.savefig(FIG / f"escala_objetos{sufijo}.png", bbox_inches="tight")
    plt.close(fig)
    print(f"escala_objetos{sufijo}.png")

# ── 2 · Curvas P1 en ingles ──────────────────────────────────────────────────
RUNS_P1 = CODE / "experiments" / "p1"
fig, ax = plt.subplots(figsize=(5.4, 3.2))
for e in ("F1", "F2", "F3", "F4", "G1", "G2", "H1", "H2"):
    p = RUNS_P1 / e / "DONE.json"
    if not p.exists():
        continue
    m = json.loads(p.read_text())
    va = m.get("hist", {}).get("va_ap50", [])
    if va:
        ax.plot(va, lw=1.4,
                label="{} ({} @{})".format(e, m["config"]["gold"],
                                           m["config"]["imgsz"]))
ax.set_title("Validation AP50 per epoch (YOLOv11n, 8 runs)", loc="left")
ax.set_xlabel("epoch"); ax.set_ylabel("AP50 (val)")
ax.legend(fontsize=6.5, ncol=2)
fig.tight_layout()
fig.savefig(FIG / "p1_curvas_en.png", bbox_inches="tight")
plt.close(fig)
print("p1_curvas_en.png")

# ── 3 · Panel CAM compacto 3x3 ───────────────────────────────────────────────
# El panel original (04) es 9 filas x 4 columnas y su cuarta columna
# (Guided x CAM) quedo negra por el rango dinamico: se toma una fila por
# dominio y las tres primeras columnas.
src = Image.open(CODE / "reports" / "figuras_p0" / "CAM_panel.png")
W, H = src.size
fh = H / 9
filas = (0, 3, 8)                    # rolid11k, taco, uavvaste
recortes = [src.crop((0, int(i * fh), int(W * 3 / 4), int((i + 1) * fh)))
            for i in filas]
w = recortes[0].width
alto = sum(r.height for r in recortes)
out = Image.new("RGB", (w, alto), "#fcfcfb")
y = 0
for r in recortes:
    out.paste(r, (0, y))
    y += r.height
out.save(FIG / "cam_panel_paper.png")
print("cam_panel_paper.png")
