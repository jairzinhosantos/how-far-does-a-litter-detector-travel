#!/usr/bin/env python3
"""Composiciones de la sesión de demo para mostrarla dentro de la presentación.

Toma lo que la notebook 07 ya produjo en demo/output/test_01/ y arma:
  d_entrada.png       las 10 imágenes de entrada, etiquetadas
  d_yolo.png          las 10 con las detecciones de YOLOv11n
  d_frcnn.png         las 10 con las detecciones de Faster R-CNN
  d_fcn.png           las 10 con la máscara del FCN
  d_gradcam.png       los 10 pares recorte + mapa de calor
  d_indicadores.png   detecciones por imagen y % de píxeles de basura

Uso:  <python del proyecto> reports/presentacion/figuras_demo.py
"""
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

AQUI = Path(__file__).resolve().parent
CODE = AQUI.parent.parent
DEMO = CODE / "demo"
SES = "test_01"
IN = DEMO / "input" / SES
OUT_DEMO = DEMO / "output" / SES
OUT = AQUI / "assets"

AZUL = "#3B6FD4"; ROJO = "#D64A3F"; AMBAR = "#E9A825"; VERDE = "#2E9E5B"
INK = "#202124"; GRIS = "#5F6368"; GRIS2 = "#9AA0A6"; REJILLA = "#E8EAED"
BG = "#FFFFFF"

plt.rcParams.update({
    "figure.dpi": 110, "savefig.dpi": 190,
    "figure.facecolor": BG, "savefig.facecolor": BG, "axes.facecolor": BG,
    "axes.edgecolor": REJILLA, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "axes.axisbelow": True, "grid.color": REJILLA,
    "axes.titlesize": 12, "axes.titleweight": "bold", "axes.titlecolor": INK,
    "axes.labelsize": 10, "axes.labelcolor": GRIS,
    "xtick.labelsize": 9, "ytick.labelsize": 9,
    "xtick.color": GRIS, "ytick.color": GRIS,
    "legend.fontsize": 9, "legend.frameon": False,
    "font.family": "sans-serif", "font.size": 10,
})

resumen = pd.read_csv(OUT_DEMO / "summary.csv")
nombres = resumen["image"].tolist()


def grilla(rutas, subtitulos, nombre, ncols=5, alto_fila=2.6, fs=9):
    """Rejilla de imágenes con subtítulo bajo cada una."""
    n = len(rutas)
    nrows = int(np.ceil(n / ncols))
    fig, axes = plt.subplots(nrows, ncols,
                             figsize=(ncols * 2.75, nrows * alto_fila))
    axes = np.atleast_1d(axes).ravel()
    for ax in axes[n:]:
        ax.axis("off")
    for ax, r, sub in zip(axes, rutas, subtitulos):
        ax.imshow(Image.open(r))
        ax.set_title(sub, fontsize=fs, color=INK, pad=4)
        ax.axis("off")
    fig.tight_layout(h_pad=1.4, w_pad=0.6)
    fig.savefig(OUT / f"{nombre}.png", bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(" ", nombre + ".png")


# ── 1 · imágenes de entrada ──────────────────────────────────────────────────
rutas_in = [IN / n for n in nombres]
subt = []
for n in nombres:
    im = Image.open(IN / n)
    subt.append(f"{n}\n{im.width}×{im.height} px")
grilla(rutas_in, subt, "d_entrada")

# ── 2 · salida por modelo ────────────────────────────────────────────────────
for carpeta, nombre_fig, col_res, sufijo_txt in (
        ("yolo", "d_yolo", "yolo_dets", "detecciones"),
        ("frcnn", "d_frcnn", "frcnn_dets", "detecciones"),
        ("fcn", "d_fcn", "litter_px_%", "% píxeles basura")):
    rutas, subt = [], []
    for _, fila in resumen.iterrows():
        stem = Path(fila["image"]).stem
        p = OUT_DEMO / carpeta / f"{stem}.jpg"
        if not p.exists():
            continue
        rutas.append(p)
        v = fila[col_res]
        txt = f"{v:.0f} {sufijo_txt}" if col_res.endswith("dets") else f"{v:.1f} {sufijo_txt}"
        subt.append(f"{stem}  ·  {txt}")
    grilla(rutas, subt, nombre_fig)

# ── 3 · Grad-CAM: pares recorte + mapa ───────────────────────────────────────
rutas, subt = [], []
for _, fila in resumen.iterrows():
    stem = Path(fila["image"]).stem
    pc, pm = OUT_DEMO / "gradcam" / f"{stem}_crop.jpg", OUT_DEMO / "gradcam" / f"{stem}_gradcam.jpg"
    if pc.exists() and pm.exists():
        rutas += [pc, pm]
        subt += [f"{stem} · recorte", f"{stem} · Grad-CAM"]
grilla(rutas, subt, "d_gradcam", ncols=8, alto_fila=2.2, fs=8)

# ── 4 · indicadores ──────────────────────────────────────────────────────────
y = np.arange(len(resumen))[::-1]
etq = [Path(n).stem for n in nombres]
fig, axes = plt.subplots(1, 2, figsize=(11.5, 4.4))
h = 0.38
axes[0].barh(y + h / 2, resumen["frcnn_dets"], h, color=AZUL,
             label="Faster R-CNN", zorder=3)
axes[0].barh(y - h / 2, resumen["yolo_dets"], h, color=AMBAR,
             label="YOLOv11n", zorder=3)
for yi, v in zip(y + h / 2, resumen["frcnn_dets"]):
    axes[0].text(v + 0.6, yi, str(int(v)), va="center", fontsize=8.5, color=AZUL)
for yi, v in zip(y - h / 2, resumen["yolo_dets"]):
    axes[0].text(v + 0.6, yi, str(int(v)), va="center", fontsize=8.5, color=AMBAR)
axes[0].set_yticks(y); axes[0].set_yticklabels(etq, fontsize=9)
axes[0].set_xlabel("detecciones por imagen")
axes[0].set_title("Faster R-CNN propone más candidatos en las 10 imágenes", loc="left", fontsize=11)
axes[0].legend(loc="lower right")
axes[1].barh(y, resumen["litter_px_%"], 0.6, color=ROJO, zorder=3)
for yi, v in zip(y, resumen["litter_px_%"]):
    axes[1].text(v + 0.25, yi, f"{v:.1f}", va="center", fontsize=8.5, color=ROJO)
axes[1].set_yticks(y); axes[1].set_yticklabels([])
axes[1].set_xlabel("% de píxeles marcados como basura (FCN)")
axes[1].set_title("Cuánta superficie de la escena está cubierta", loc="left", fontsize=11)
fig.tight_layout()
fig.savefig(OUT / "d_indicadores.png", bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("  d_indicadores.png")

# ── 5 · totales para la lámina de lectura ────────────────────────────────────
print("\ntotales:  YOLO", int(resumen["yolo_dets"].sum()),
      "· FRCNN", int(resumen["frcnn_dets"].sum()),
      "· px basura medio", round(resumen["litter_px_%"].mean(), 1),
      "· P(litter) min", resumen["P(litter)"].min())
