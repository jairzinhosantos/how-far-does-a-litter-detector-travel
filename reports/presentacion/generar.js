// Presentación de defensa — ¿Qué tan lejos viaja un detector de basura?
// Genera presentacion.pptx · node generar.js
// 31 láminas de contenido + 6 de apéndice · notas = speech con marcas de tiempo
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const path = require("path");

const A = p => path.join(__dirname, "assets", p);
const FF = p => path.join(__dirname, "..", "figuras_final", p);
const FP1 = p => path.join(__dirname, "..", "figuras_p1", p);
const LOGO = A("uni_logo.png");

// paleta del proyecto
const BG = "FCFCFB", INK = "1A1A19", GRIS = "52514E", GRIS2 = "8A8A80";
const AZUL = "2A78D6", NARANJA = "EB6834", VERDE = "1BAF7A", ROJO = "C0392B", AMBAR = "F0A202";
const F = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

// ── helpers ──────────────────────────────────────────────────────────────────
async function dim(file) {
  const m = await sharp(file).metadata();
  return { w: m.width, h: m.height };
}
async function fit(slide, file, x, y, boxW, boxH, opts = {}) {
  const { w, h } = await dim(file);
  const r = Math.min(boxW / w, boxH / h);
  const iw = w * r, ih = h * r;
  slide.addImage({ path: file, x: x + (boxW - iw) / 2, y: y + (boxH - ih) / 2,
                   w: iw, h: ih, ...opts });
}
const LOGO_AR = 1200 / 1509;   // ancho / alto

function logoClaro(s) {           // láminas de contenido (fondo claro)
  const h = 0.44, w = h * LOGO_AR;
  s.addImage({ path: LOGO, x: 12.62, y: 0.26, w, h });
  s.addText("Universidad Nacional de Ingeniería", { x: 9.4, y: 0.36, w: 3.1, h: 0.3,
    fontFace: F, fontSize: 8, color: GRIS2, align: "right", margin: 0 });
}
function logoOscuro(s, x, y, alto) {   // sobre fondo oscuro: badge blanco
  const w = alto * LOGO_AR, pad = alto * 0.16;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - pad, y: y - pad,
    w: w + pad * 2, h: alto + pad * 2, fill: { color: "FFFFFF" },
    line: { color: "FFFFFF", width: 0.5 }, rectRadius: 0.05 });
  s.addImage({ path: LOGO, x, y, w, h: alto });
}
function base(dark = false) {
  const s = pres.addSlide();
  s.background = { color: dark ? INK : BG };
  return s;
}
function contenido(titulo, kicker) {
  const s = base();
  if (kicker) s.addText(kicker.toUpperCase(), { x: 0.6, y: 0.38, w: 7, h: 0.3,
    fontFace: F, fontSize: 11, color: NARANJA, bold: true, charSpacing: 2, margin: 0 });
  s.addText(titulo, { x: 0.6, y: kicker ? 0.62 : 0.45, w: 10.6, h: 0.85,
    fontFace: F, fontSize: 30, color: INK, bold: true, margin: 0 });
  logoClaro(s);
  return s;
}

(async () => {

// ═══ 1 · PORTADA ═════════════════════════════════════════════════════════════
{
  const s = base(true);
  await fit(s, A("portada_strip.jpg"), 0.4, 4.85, 12.5, 2.05);
  logoOscuro(s, 11.75, 0.55, 0.95);
  s.addText("¿QUÉ TAN LEJOS VIAJA UN DETECTOR DE BASURA?", {
    x: 0.7, y: 1.25, w: 10.6, h: 1.5, fontFace: F, fontSize: 38, bold: true,
    color: "FFFFFF", margin: 0 });
  s.addText("Detección cross-domain de residuos urbanos en imágenes de mano, dashcam y dron", {
    x: 0.7, y: 2.8, w: 11.0, h: 0.6, fontFace: F, fontSize: 18, color: "C9C9C4", margin: 0 });
  s.addText([
    { text: "Jairzinho Santos", options: { bold: true, color: "FFFFFF" } },
    { text: "   ·   Visión Computacional · Maestría en Inteligencia Artificial", options: { color: "9A9A92" } },
  ], { x: 0.7, y: 3.65, w: 11.5, h: 0.4, fontFace: F, fontSize: 14, margin: 0 });
  s.addText("Universidad Nacional de Ingeniería · 2026-I", {
    x: 0.7, y: 4.05, w: 8, h: 0.35, fontFace: F, fontSize: 12, color: "9A9A92", margin: 0 });
  s.addNotes(`[00:00 – 00:45]

Buenos días. Mi nombre es Jairzinho Santos y voy a presentar mi proyecto final del curso de Visión Computacional.

El título es una pregunta: ¿qué tan lejos viaja un detector de basura? Y la pregunta es literal. Imaginen una ciudad que quiere monitorear sus residuos: recibe fotos de los vecinos desde sus celulares, tiene cámaras en los camiones recolectores y usa drones para las zonas difíciles. Tres formas de ver el mismo problema.

Todo el mundo asume que un detector entrenado con una de ellas sirve para las otras. Lo que encontré es que nadie lo había medido. Eso es lo que hice.`);
}

// ═══ 2 · AGENDA ══════════════════════════════════════════════════════════════
{
  const s = contenido("Agenda");
  const items = ["El contexto y el problema", "Metodologías y su justificación",
    "Métricas de evaluación", "La propuesta y el diseño experimental",
    "Resultados", "Limitaciones, retos y lecciones",
    "Conclusiones y trabajo futuro", "Demostración en vivo"];
  items.forEach((t, i) => {
    const col = i < 4 ? 0 : 1;
    const y = 1.9 + (i % 4) * 1.18;
    s.addText(String(i + 1).padStart(2, "0"), { x: 0.9 + col * 6.2, y, w: 0.85, h: 0.6,
      fontFace: F, fontSize: 26, bold: true, color: NARANJA, margin: 0 });
    s.addText(t, { x: 1.85 + col * 6.2, y: y + 0.05, w: 4.9, h: 0.6,
      fontFace: F, fontSize: 18, color: INK, margin: 0 });
  });
  s.addNotes(`[00:45 – 01:15]

El recorrido es este: primero el contexto y el problema; luego las metodologías que elegí y —sobre todo— por qué las elegí; después las métricas, que voy a explicar con detalle porque son las que sostienen toda la interpretación.

Sigue la propuesta y el diseño experimental, los resultados, las limitaciones y las lecciones. Y cierro ejecutando el sistema en vivo con imágenes que voy a descargar en ese momento.`);
}

// ═══ 3 · CONTEXTO / IMPACTO ══════════════════════════════════════════════════
{
  const s = contenido("La basura urbana es un problema de escala mundial", "El contexto");
  await fit(s, A("impacto.jpg"), 7.05, 1.62, 5.7, 4.7);
  const stats = [
    ["2 010 millones t", "de residuos sólidos urbanos se generan al año en el mundo"],
    ["33 %", "se gestiona de forma ambientalmente insegura"],
    ["3 400 millones t", "proyectadas para 2050 si nada cambia"],
  ];
  stats.forEach(([n, t], i) => {
    const y = 1.72 + i * 1.5;
    s.addText(n, { x: 0.6, y, w: 5.9, h: 0.62, fontFace: F, fontSize: 30, bold: true,
      color: NARANJA, margin: 0 });
    s.addText(t, { x: 0.6, y: y + 0.62, w: 5.9, h: 0.62, fontFace: F, fontSize: 14,
      color: GRIS, margin: 0 });
  });
  s.addText("El monitoreo sigue siendo manual: costoso, lento y de cobertura limitada.",
    { x: 0.6, y: 6.25, w: 6.0, h: 0.45, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText("Fuente: Banco Mundial, What a Waste 2.0 (Kaza et al., 2018). Imagen: sesión de la demo del proyecto.",
    { x: 0.6, y: 6.75, w: 12.1, h: 0.3, fontFace: F, fontSize: 9, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[01:15 – 02:00]

Primero, por qué importa. Según el Banco Mundial, en su informe What a Waste 2.0, el mundo genera 2 010 millones de toneladas de residuos sólidos urbanos al año. Un tercio se gestiona de forma ambientalmente insegura. Y la proyección al 2050 es de 3 400 millones de toneladas.

Detrás de esas cifras hay un problema operativo muy concreto: el monitoreo de residuos en las calles sigue siendo manual. Alguien tiene que ir, mirar y reportar. Es caro, es lento y cubre poco.

La visión computacional puede automatizar esa capa de monitoreo. Por eso existe este trabajo.`);
}

// ═══ 4 · TRES DOMINIOS ═══════════════════════════════════════════════════════
{
  const s = contenido("El mismo objeto, tres puntos de vista incompatibles", "El problema");
  const doms = [
    ["dominio_taco.png", "TACO · mano", "1 500 imágenes · objeto mediano 171 px", AZUL],
    ["dominio_rolid.png", "RoLID-11K · dashcam", "11 564 imágenes · objeto mediano 22 px", NARANJA],
    ["dominio_uav.png", "UAVVaste · dron", "772 imágenes · objeto mediano 72 px", VERDE],
  ];
  for (let i = 0; i < 3; i++) {
    const [img, tit, sub, col] = doms[i];
    const x = 0.6 + i * 4.15;
    await fit(s, A(img), x, 1.75, 3.9, 2.95);
    s.addText(tit, { x, y: 4.8, w: 3.9, h: 0.4, fontFace: F, fontSize: 16, bold: true,
      color: col, margin: 0 });
    s.addText(sub, { x, y: 5.2, w: 3.9, h: 0.4, fontFace: F, fontSize: 12, color: GRIS, margin: 0 });
  }
  s.addText([
    { text: "Cada dataset se evalúa en su propio dominio. ", options: { color: GRIS } },
    { text: "Nadie había medido qué pasa al cruzarlos.", options: { bold: true, color: INK } },
  ], { x: 0.6, y: 6.15, w: 12.1, h: 0.5, fontFace: F, fontSize: 16, margin: 0 });
  s.addNotes(`[02:00 – 02:50]

El problema tiene tres datasets públicos, cada uno con un punto de vista distinto.

TACO: mil quinientas fotos tomadas a mano, a nivel de peatón, con un objeto mediano de 171 píxeles.

RoLID-11K: once mil quinientas imágenes de dashcam, cámara de vehículo. Aquí está el número clave: el objeto mediano mide 22 píxeles.

Y UAVVaste: 772 imágenes de dron, con 72 píxeles de mediana.

Fíjense en el rango: de 22 a 171 píxeles. Es casi un orden de magnitud de diferencia en la escala del objeto. Cada uno de estos datasets se publica y se evalúa dentro de su propio dominio. Nadie había medido qué pasa al cruzarlos.`);
}

// ═══ 5 · LA PREGUNTA ═════════════════════════════════════════════════════════
{
  const s = base(true);
  logoOscuro(s, 12.25, 0.5, 0.6);
  s.addText("PREGUNTA DE INVESTIGACIÓN", { x: 0.7, y: 1.5, w: 8, h: 0.35,
    fontFace: F, fontSize: 12, color: NARANJA, bold: true, charSpacing: 2, margin: 0 });
  s.addText("¿Cuánto se degrada un detector de residuos al cambiar de punto de vista, y qué pesa más para cerrar la brecha?",
    { x: 0.7, y: 2.1, w: 11.9, h: 2.2, fontFace: F, fontSize: 32, bold: true,
      color: "FFFFFF", margin: 0 });
  s.addText("arquitectura  ·  resolución de entrada  ·  higiene de los datos",
    { x: 0.7, y: 4.6, w: 11.9, h: 0.5, fontFace: F, fontSize: 18, color: "C9C9C4", margin: 0 });
  s.addNotes(`[02:50 – 03:30]

De ahí sale la pregunta de investigación: cuánto se degrada un detector de residuos al cambiar de punto de vista, y qué pesa más para cerrar esa brecha.

Hay tres sospechosos: la arquitectura del modelo, la resolución de entrada, o la higiene de los datos de entrenamiento. El diseño experimental que voy a mostrar mide los tres.`);
}

// ═══ 6 · CONCEPTOS: CLASIFICACIÓN Y TRANSFERENCIA ════════════════════════════
{
  const s = contenido("Clasificación y transferencia de aprendizaje", "Metodologías · 1 de 3");
  const cajas = [
    ["Red preentrenada", "VGG-16 entrenada con 1.2 M de imágenes (ImageNet)", AZUL],
    ["Se conserva lo aprendido", "las capas convolucionales ya saben ver bordes, texturas, formas", GRIS2],
    ["Se reentrena la cabeza", "clasificador nuevo: ¿hay basura en este recorte?", NARANJA],
  ];
  cajas.forEach(([t, d, col], i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: 3.85, h: 1.9,
      fill: { color: col === GRIS2 ? "EFEFEA" : col, transparency: col === GRIS2 ? 0 : 88 },
      line: { color: col, width: 1.2 }, rectRadius: 0.06 });
    s.addText(t, { x: x + 0.25, y: 2.2, w: 3.35, h: 0.5, fontFace: F, fontSize: 16,
      bold: true, color: INK, margin: 0 });
    s.addText(d, { x: x + 0.25, y: 2.75, w: 3.35, h: 1.0, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
    if (i < 2) s.addText("→", { x: x + 3.86, y: 2.6, w: 0.3, h: 0.6, fontFace: F,
      fontSize: 22, color: GRIS2, margin: 0, align: "center" });
  });
  await fit(s, A("gradcam_crop.jpg"), 3.4, 4.35, 2.6, 2.35);
  s.addText("recorte de 224×224:\n¿basura o fondo?", { x: 6.25, y: 5.15, w: 3.4, h: 0.9,
    fontFace: F, fontSize: 13, color: GRIS, margin: 0 });
  s.addText("En el proyecto: VGG-16 sobre recortes — 97.8 % de exactitud en test.",
    { x: 0.6, y: 6.8, w: 12.1, h: 0.4, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addNotes(`[03:30 – 04:30]

Antes de los resultados necesito dejar claras cuatro herramientas y cinco métricas. Voy rápido, pero sin saltarme lo esencial.

La primera herramienta es la transferencia de aprendizaje. VGG-16 es una red entrenada con más de un millón de imágenes de ImageNet. Sus capas convolucionales ya aprendieron a ver bordes, texturas y formas: eso es conocimiento genérico y no hace falta reaprenderlo.

Lo que hago es conservar esa parte —congelada o ajustada suavemente— y reentrenar solo la cabeza clasificadora con mi pregunta: ¿hay basura en este recorte de 224 por 224 píxeles?

En el proyecto esto alcanza 97.8 por ciento de exactitud en test.`);
}

// ═══ 7 · CONCEPTOS: DETECCIÓN (+ anclas y pérdida) ═══════════════════════════
{
  const s = contenido("Detección: localizar además de clasificar", "Metodologías · 2 de 3");
  s.addText("Dos etapas · Faster R-CNN — 41.3 M parámetros", { x: 0.6, y: 1.65, w: 5.9, h: 0.4,
    fontFace: F, fontSize: 16, bold: true, color: AZUL, margin: 0 });
  s.addText("El RPN propone regiones a partir de anclas; cada región se clasifica y se refina",
    { x: 0.6, y: 2.08, w: 5.8, h: 0.6, fontFace: F, fontSize: 12.5, color: GRIS, margin: 0 });
  await fit(s, A("frcnn_ej.jpg"), 0.6, 2.7, 5.8, 2.5);
  s.addText("Una etapa · YOLOv11n — 2.6 M parámetros", { x: 6.9, y: 1.65, w: 5.9, h: 0.4,
    fontFace: F, fontSize: 16, bold: true, color: NARANJA, margin: 0 });
  s.addText("Una grilla sobre la imagen; cada celda predice cajas y clases en una sola pasada",
    { x: 6.9, y: 2.08, w: 5.8, h: 0.6, fontFace: F, fontSize: 12.5, color: GRIS, margin: 0 });
  await fit(s, A("yolo_ej.jpg"), 6.9, 2.7, 5.8, 2.5);
  // banda de fórmulas
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.42, w: 12.1, h: 1.55,
    fill: { color: "EFEFEA" }, line: { color: RE_LINE(), width: 1 }, rectRadius: 0.05 });
  s.addText([
    { text: "Anclas del FPN:  ", options: { bold: true, color: INK } },
    { text: "escalas {32², 64², 128², 256², 512²} px  ×  razones {1:2, 1:1, 2:1}, en 5 niveles de la pirámide.  ", options: { color: GRIS } },
    { text: "El objeto mediano de dashcam (22 px) cae por debajo de la más pequeña.", options: { bold: true, color: ROJO } },
  ], { x: 0.9, y: 5.62, w: 11.5, h: 0.75, fontFace: F, fontSize: 14, margin: 0 });
  s.addText([
    { text: "Pérdida multi-tarea:   ", options: { bold: true, color: INK } },
    { text: "L = L", options: { color: GRIS } },
    { text: "cls", options: { color: GRIS, fontSize: 10 } },
    { text: "  +  λ · L", options: { color: GRIS } },
    { text: "box", options: { color: GRIS, fontSize: 10 } },
    { text: "        (clasificar qué es  +  regresionar dónde está)", options: { color: GRIS2, italic: true } },
  ], { x: 0.9, y: 6.35, w: 11.5, h: 0.45, fontFace: F, fontSize: 14, margin: 0 });
  s.addNotes(`[04:30 – 05:45]

La segunda herramienta es la detección, que además de clasificar tiene que localizar. Hay dos filosofías.

Faster R-CNN trabaja en dos etapas: una red de propuestas —el RPN— sugiere regiones candidatas a partir de anclas, que son cajas de referencia de tamaños fijos; luego cada región se clasifica y se refina. YOLO lo hace en una sola pasada: divide la imagen en una grilla y cada celda predice cajas y clases directamente.

Las dos imágenes son la misma foto de mi demo procesada por ambos modelos.

Y abajo está el detalle que explica el resultado principal de todo el trabajo. Las anclas del FPN tienen escalas de 32, 64, 128, 256 y 512 píxeles al cuadrado, con tres razones de aspecto, en cinco niveles de la pirámide. La más pequeña es de 32 píxeles. El objeto mediano de dashcam mide 22. Cae por debajo. Retengan ese dato, porque vuelve en resultados.

La pérdida es multi-tarea: un término de clasificación más un término de regresión de la caja, ponderado por lambda.`);
}

// ═══ 8 · CONCEPTOS: SEGMENTACIÓN E INTERPRETABILIDAD ═════════════════════════
{
  const s = contenido("Segmentación e interpretabilidad", "Metodologías · 3 de 3");
  s.addText("Segmentación · FCN-ResNet18", { x: 0.6, y: 1.7, w: 5.8, h: 0.4, fontFace: F,
    fontSize: 17, bold: true, color: ROJO, margin: 0 });
  s.addText("Decide píxel por píxel: ¿basura o fondo? Entropía cruzada ponderada por clase, porque el fondo domina la imagen.",
    { x: 0.6, y: 2.13, w: 5.8, h: 0.85, fontFace: F, fontSize: 12.5, color: GRIS, margin: 0 });
  await fit(s, A("fcn_overlay.jpg"), 0.6, 3.05, 5.8, 3.1);
  s.addText("Interpretabilidad · CAM y Grad-CAM", { x: 6.9, y: 1.7, w: 5.8, h: 0.4, fontFace: F,
    fontSize: 17, bold: true, color: VERDE, margin: 0 });
  s.addText("¿Dónde miró la red para decidir? El gradiente de la clase pondera los mapas de activación e ilumina las zonas que pesaron.",
    { x: 6.9, y: 2.13, w: 5.8, h: 0.85, fontFace: F, fontSize: 12.5, color: GRIS, margin: 0 });
  await fit(s, A("gradcam_crop.jpg"), 6.9, 3.05, 2.8, 3.1);
  await fit(s, A("gradcam_mapa.jpg"), 9.9, 3.05, 2.8, 3.1);
  s.addNotes(`[05:45 – 06:30]

Las otras dos herramientas.

La segmentación, con una red totalmente convolucional, decide píxel por píxel si algo es basura o fondo. Sirve para estimar cuánta superficie está cubierta, no solo cuántos objetos hay. Uso entropía cruzada ponderada por clase, porque el fondo domina ampliamente la imagen y sin ponderar la red aprendería a decir "todo es fondo".

Y Grad-CAM responde una pregunta de auditoría: ¿dónde miró la red para decidir? Usa el gradiente de la clase para ponderar los mapas de activación e iluminar las zonas que pesaron en la decisión.

Aquí ven un recorte y su mapa: la activación está sobre el objeto, no sobre el pasto.`);
}

// ═══ 9 · JUSTIFICACIÓN DE LAS TÉCNICAS (NUEVA) ═══════════════════════════════
{
  const s = contenido("Por qué estas técnicas y no otras", "Metodologías · justificación");
  const filas = [
    ["Transferencia, no entrenar desde cero", "TACO tiene 1 500 imágenes y VGG-16 tiene 138 M de parámetros: entrenar desde cero exigiría del orden de 10⁶ imágenes", AZUL],
    ["Backbone ResNet-50 + FPN", "la pirámide predice en 5 escalas; con objetos de 22 a 171 px entre dominios, una sola escala no alcanza", AZUL],
    ["Faster R-CNN (dos etapas)", "su RPN expone las anclas de forma explícita: vuelve medible la hipótesis de escala, no solo observable", NARANJA],
    ["YOLOv11n (una etapa, 2.6 M)", "referencia moderna y prueba de la hipótesis de despliegue: es el tamaño que cabe en un dispositivo de borde", NARANJA],
    ["FCN con ResNet-18", "la tarea es binaria y densa; un backbone ligero basta y libera presupuesto de cómputo para los detectores", ROJO],
    ["CAM / Grad-CAM", "riesgo real de que el clasificador aprenda el fondo (vereda, pasto) en vez del objeto; la interpretabilidad lo audita", VERDE],
  ];
  filas.forEach(([t, d, c], i) => {
    const y = 1.72 + i * 0.85;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.62, y: y + 0.09, w: 0.09, h: 0.5,
      fill: { color: c }, line: { color: c, width: 0 } });
    s.addText(t, { x: 0.95, y, w: 4.15, h: 0.7, fontFace: F, fontSize: 14, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 5.25, y: y + 0.03, w: 7.45, h: 0.7, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
  });
  s.addText("Los detectores transformer (CO-DETR) quedaron fuera por la regla de presupuesto de 20 h por experimento; están declarados como trabajo futuro.",
    { x: 0.95, y: 6.85, w: 11.8, h: 0.4, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[06:30 – 07:45]

Ahora la pregunta que de verdad importa: por qué estas técnicas y no otras.

Transferencia en lugar de entrenar desde cero, porque TACO tiene mil quinientas imágenes y VGG tiene 138 millones de parámetros. Entrenar desde cero exigiría del orden de un millón de imágenes.

El backbone es ResNet-50 con FPN porque la pirámide de características predice en cinco escalas distintas, y mi problema tiene objetos que van de 22 a 171 píxeles: con una sola escala no hay forma de cubrir ese rango.

Elegí Faster R-CNN de dos etapas precisamente porque su RPN expone las anclas de manera explícita. Eso convierte mi hipótesis sobre la escala en algo medible, no solo observable: puedo contrastar el tamaño del ancla contra el tamaño real del objeto.

YOLOv11n entra como referencia moderna y, sobre todo, para probar la hipótesis de despliegue: 2.6 millones de parámetros es lo que cabría en un dispositivo de borde montado en un camión municipal.

FCN con ResNet-18 porque la tarea es binaria y densa; un backbone ligero basta y me libera presupuesto de cómputo para los detectores, que es donde estaba el costo real.

Y CAM porque había un riesgo concreto: que el clasificador aprendiera el fondo —la vereda, el pasto— en lugar del objeto. La interpretabilidad es la que audita eso.

Los transformers quedaron fuera por la regla de presupuesto y están declarados en trabajo futuro.`);
}

// ═══ 10 · MÉTRICAS: IoU ══════════════════════════════════════════════════════
{
  const s = contenido("IoU: qué tan bien coinciden dos cajas", "Métricas · 1 de 5");
  s.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 2.2, w: 3.2, h: 2.4,
    fill: { color: AZUL, transparency: 75 }, line: { color: AZUL, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.7, y: 3.1, w: 3.2, h: 2.4,
    fill: { color: NARANJA, transparency: 75 }, line: { color: NARANJA, width: 2 } });
  s.addText("realidad (GT)", { x: 1.3, y: 1.82, w: 2.5, h: 0.35, fontFace: F, fontSize: 12,
    bold: true, color: AZUL, margin: 0 });
  s.addText("predicción", { x: 3.9, y: 5.55, w: 2.0, h: 0.35, fontFace: F, fontSize: 12,
    bold: true, color: NARANJA, margin: 0 });
  s.addText("intersección", { x: 2.78, y: 3.85, w: 1.6, h: 0.35, fontFace: F, fontSize: 11,
    bold: true, color: INK, margin: 0 });
  s.addText("IoU  =", { x: 7.0, y: 2.6, w: 1.4, h: 0.6, fontFace: F, fontSize: 24,
    bold: true, color: INK, margin: 0 });
  s.addText("área de intersección", { x: 8.5, y: 2.35, w: 3.6, h: 0.5, fontFace: F,
    fontSize: 18, color: INK, align: "center", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 8.5, y: 2.92, w: 3.6, h: 0, line: { color: INK, width: 1.5 } });
  s.addText("área de unión", { x: 8.5, y: 3.0, w: 3.6, h: 0.5, fontFace: F,
    fontSize: 18, color: INK, align: "center", margin: 0 });
  s.addText([
    { text: "Regla del estándar COCO:  ", options: { color: GRIS } },
    { text: "IoU ≥ 0.5 → la detección cuenta como correcta", options: { bold: true, color: INK } },
  ], { x: 7.0, y: 4.2, w: 5.6, h: 0.9, fontFace: F, fontSize: 15, margin: 0 });
  s.addText("0 = no se tocan   ·   1 = coincidencia perfecta", { x: 7.0, y: 5.2, w: 5.6, h: 0.4,
    fontFace: F, fontSize: 13, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[07:45 – 08:20]

Vamos a las métricas. Todo empieza con IoU: intersección sobre unión.

Tengo la caja real, en azul, y la caja predicha, en naranja. IoU es el área de la intersección dividida entre el área de la unión. Cero si no se tocan, uno si coinciden perfectamente.

El estándar COCO fija el umbral en 0.5: si la superposición llega a la mitad, la detección cuenta como correcta. Todo lo que viene después se apoya en esta definición.`);
}

// ═══ 11 · MÉTRICAS: TP/FP/FN ═════════════════════════════════════════════════
{
  const s = contenido("Precisión y recall sobre una imagen real del proyecto", "Métricas · 2 de 5");
  await fit(s, A("tpfpfn.png"), 0.6, 1.75, 4.6, 5.0);
  const leyenda = [
    ["Verdadero positivo (TP)", "detectó basura que sí estaba", VERDE],
    ["Falso positivo (FP)", "detectó basura donde no había", AMBAR],
    ["Falso negativo (FN)", "basura real que no encontró", ROJO],
  ];
  leyenda.forEach(([t, d, c], i) => {
    const y = 1.9 + i * 0.85;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: y + 0.05, w: 0.32, h: 0.32,
      fill: { color: BG }, line: { color: c, width: 3 } });
    s.addText(t, { x: 6.1, y, w: 4.3, h: 0.4, fontFace: F, fontSize: 14, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 6.1, y: y + 0.36, w: 4.6, h: 0.35, fontFace: F, fontSize: 12,
      color: GRIS, margin: 0 });
  });
  s.addText([
    { text: "Precisión = TP / (TP + FP)", options: { bold: true, color: AZUL } },
    { text: "   de lo que dije, cuánto era cierto\n", options: { color: GRIS } },
    { text: "Recall = TP / (TP + FN)", options: { bold: true, color: NARANJA } },
    { text: "        de lo que había, cuánto encontré", options: { color: GRIS } },
  ], { x: 5.6, y: 4.75, w: 7.1, h: 1.2, fontFace: F, fontSize: 16, margin: 0, lineSpacing: 30 });
  s.addText("Imagen de test de TACO evaluada con nuestro YOLOv11n (F1): 2 TP, 1 FP, 1 FN.",
    { x: 5.6, y: 6.15, w: 7.1, h: 0.4, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[08:20 – 09:00]

Con ese umbral clasifico cada predicción. Esto no es un diagrama: es una imagen real del conjunto de test de TACO, evaluada con mi modelo.

En verde, verdaderos positivos: detectó basura que sí estaba. En ámbar, un falso positivo: detectó donde no había. En rojo, un falso negativo: basura real que no encontró.

De ahí salen las dos preguntas fundamentales. Precisión: de todo lo que dije, cuánto era cierto. Recall: de todo lo que había, cuánto encontré. Son las dos caras del error, y casi siempre están en tensión.`);
}

// ═══ 12 · MÉTRICAS: CURVA PR → AP ════════════════════════════════════════════
{
  const s = contenido("AP: resumir el compromiso precisión-recall en un número", "Métricas · 3 de 5");
  await fit(s, A("pr_curva.png"), 0.6, 1.7, 6.6, 5.0);
  const pasos = [
    ["1", "El umbral de confianza es una perilla: bajarlo encuentra más (sube recall) pero inventa más (baja precisión)"],
    ["2", "Recorrer todos los umbrales dibuja la curva precisión-recall"],
    ["3", "AP = área bajo esa curva: un solo número que resume todo el compromiso"],
  ];
  pasos.forEach(([n, t], i) => {
    const y = 1.95 + i * 1.35;
    s.addText(n, { x: 7.6, y, w: 0.55, h: 0.5, fontFace: F, fontSize: 22, bold: true,
      color: NARANJA, margin: 0 });
    s.addText(t, { x: 8.25, y: y + 0.03, w: 4.5, h: 1.2, fontFace: F, fontSize: 13.5,
      color: GRIS, margin: 0 });
  });
  s.addText("Curva real: nuestro F2 sobre el test de RoLID — el área da exactamente el 0.695 que reportamos.",
    { x: 7.6, y: 6.0, w: 5.1, h: 0.8, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[09:00 – 09:45]

Precisión y recall están en tensión, y quien las gobierna es el umbral de confianza. Si lo bajo, encuentro más cosas —sube el recall— pero también invento más —baja la precisión—.

Si recorro todos los umbrales posibles, obtengo esta curva. Y el AP, average precision, es el área bajo esa curva: un solo número que resume todo el compromiso, sin tener que fijar un umbral arbitrario.

Quiero subrayar algo: esta curva no es ilustrativa. La calculé con las predicciones guardadas de uno de mis modelos, y el área da 0.695, que es exactamente el número que voy a reportar en resultados.`);
}

// ═══ 13 · MÉTRICAS: FAMILIA AP ═══════════════════════════════════════════════
{
  const s = contenido("La familia AP: cuatro variantes de la misma idea", "Métricas · 4 de 5");
  const cards = [
    ["AP50", "AP con la regla IoU ≥ 0.50", "la métrica principal del proyecto", AZUL],
    ["AP50-95", "promedio de AP con IoU = 0.50, 0.55, … 0.95", "premia la localización fina", GRIS2],
    ["mAP", "mAP = (1/K) · Σ APₖ  — promedio del AP de las K clases", "en multiclase: cada material pesa igual", NARANJA],
    ["AP-small", "el mismo AP, contado solo sobre objetos < 32×32 px", "LA métrica de este problema: el objeto mediano de dashcam mide 22 px", ROJO],
  ];
  cards.forEach(([t, f, d, c], i) => {
    const x = 0.6 + (i % 2) * 6.25, y = 1.8 + Math.floor(i / 2) * 2.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.95, h: 2.15,
      fill: { color: c, transparency: 90 }, line: { color: c, width: 1.4 }, rectRadius: 0.06 });
    s.addText(t, { x: x + 0.3, y: y + 0.18, w: 5.3, h: 0.5, fontFace: F, fontSize: 20,
      bold: true, color: INK, margin: 0 });
    s.addText(f, { x: x + 0.3, y: y + 0.72, w: 5.4, h: 0.6, fontFace: F, fontSize: 14,
      color: INK, margin: 0 });
    s.addText(d, { x: x + 0.3, y: y + 1.4, w: 5.4, h: 0.65, fontFace: F, fontSize: 12,
      italic: true, color: GRIS, margin: 0 });
  });
  s.addText("Todas se calculan con pycocotools contra los mismos ground truths congelados — una sola vara para los 19 experimentos.",
    { x: 0.6, y: 6.6, w: 12.1, h: 0.5, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addNotes(`[09:45 – 10:30]

De ahí sale una familia de métricas.

AP50 es el AP con el umbral de IoU en 0.5, y es la métrica principal del proyecto. AP50-95 promedia el AP con umbrales del 0.5 al 0.95, y premia la localización fina.

mAP es el promedio del AP de cada clase —uno partido K por la suma de los AP de las K clases— para que ninguna clase mayoritaria domine el resultado.

Y AP-small es el mismo AP contado solo sobre objetos de menos de 32 por 32 píxeles. Esa es LA métrica de este problema, porque el objeto mediano de dashcam mide 22 píxeles: casi todo lo que importa vive en esa cubeta.

Todas se calculan con la misma herramienta, pycocotools, contra los mismos ground truths congelados. Una sola vara para los diecinueve experimentos.`);
}

// ═══ 14 · MÉTRICAS: OTRAS VARAS ══════════════════════════════════════════════
{
  const s = contenido("Las varas de las otras tareas", "Métricas · 5 de 5");
  const cards = [
    ["IoU de máscara", "la misma intersección/unión, pero sobre píxeles de la máscara", "FCN: 0.577 en test", ROJO],
    ["Exactitud (accuracy)", "aciertos / total de recortes clasificados", "VGG-16: 97.8 % en test", VERDE],
    ["TIDE · dAP", "cuánto AP se recupera al corregir cada tipo de error (Cls, Loc, Bkg, Miss…)", "la anatomía del error de los 13 detectores", AZUL],
  ];
  cards.forEach(([t, f, d, c], i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 3.9, h: 2.5,
      fill: { color: c, transparency: 90 }, line: { color: c, width: 1.4 }, rectRadius: 0.06 });
    s.addText(t, { x: x + 0.25, y: 2.05, w: 3.4, h: 0.5, fontFace: F, fontSize: 17,
      bold: true, color: INK, margin: 0 });
    s.addText(f, { x: x + 0.25, y: 2.6, w: 3.4, h: 1.0, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
    s.addText(d, { x: x + 0.25, y: 3.7, w: 3.4, h: 0.5, fontFace: F, fontSize: 12,
      bold: true, color: c, margin: 0 });
  });
  await fit(s, FF("tide_descomposicion.png"), 2.9, 4.55, 7.5, 2.5);
  s.addNotes(`[10:30 – 11:00]

Las otras tareas tienen sus propias varas.

Segmentación se mide con IoU de máscara: la misma idea de intersección sobre unión, pero contada sobre píxeles. Mi FCN llega a 0.577.

Clasificación con exactitud simple: aciertos sobre total. El VGG llega a 97.8 por ciento.

Y TIDE descompone el error: me dice cuánto AP recuperaría si corrigiera cada tipo de error por separado —clasificación, localización, falsos positivos de fondo, objetos no detectados—. Esa figura va a volver en resultados con un hallazgo que no esperaba.`);
}

// ═══ 15 · PIPELINE ═══════════════════════════════════════════════════════════
{
  const s = contenido("Un pipeline auditado de punta a punta", "La propuesta");
  await fit(s, A("pipeline.png"), 0.35, 1.9, 12.63, 2.5);
  const pies = [
    ["Datos con linaje", "4 capas verificadas por SHA-256; cada flecha es una notebook reproducible"],
    ["Dos carriles de cómputo", "Mac (MPS) y Colab (A100), gobernados por guardianes automáticos"],
    ["Una sola vara", "los 19 experimentos se evalúan con el mismo contrato métrico"],
  ];
  pies.forEach(([t, d], i) => {
    const x = 0.6 + i * 4.15;
    s.addText(t, { x, y: 4.95, w: 3.9, h: 0.4, fontFace: F, fontSize: 14.5, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x, y: 5.37, w: 3.9, h: 0.8, fontFace: F, fontSize: 12,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[11:00 – 11:50]

Esta es la propuesta completa.

Los datos entran por una arquitectura medallón de cuatro capas: raw inmutable con verificación de checksums, bronze descomprimido, silver —donde vive toda la curación y la auditoría— y gold con los formatos listos para entrenar.

Cada capa se verifica con SHA-256 contra la anterior, y cada flecha del diagrama es una notebook que cualquiera puede ejecutar; los números sobre las flechas son justamente el número de notebook.

El entrenamiento corre en dos carriles de hardware gobernados por guardianes automáticos, y todo desemboca en un único contrato de evaluación. Ese contrato es lo que hace comparables los diecinueve experimentos entre sí.`);
}

// ═══ 16 · AUDITORÍA H4 ═══════════════════════════════════════════════════════
{
  const s = contenido("Auditar antes de entrenar: 7 defectos encontrados", "La propuesta");
  s.addText("El mayor: fuga a nivel de video en los splits oficiales de RoLID-11K (H4)",
    { x: 0.6, y: 1.72, w: 12.0, h: 0.45, fontFace: F, fontSize: 16, bold: true, color: ROJO, margin: 0 });
  const asig = ["TRAIN", "TRAIN", "TEST", "TRAIN", "TEST"];
  for (let i = 0; i < 5; i++) {
    const x = 0.9 + i * 2.45, esTest = asig[i] === "TEST";
    const c = esTest ? NARANJA : AZUL;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.5, w: 2.15, h: 1.5,
      fill: { color: c, transparency: 82 }, line: { color: c, width: 1.6 }, rectRadius: 0.05 });
    s.addText("frame " + (i + 1), { x, y: 2.95, w: 2.15, h: 0.4, fontFace: F, fontSize: 13,
      color: INK, align: "center", margin: 0 });
    s.addText(asig[i], { x, y: 4.1, w: 2.15, h: 0.35, fontFace: F, fontSize: 12,
      bold: true, color: c, align: "center", margin: 0 });
  }
  s.addText("mismo video · frames casi idénticos (87 % de redundancia visual)", {
    x: 0.9, y: 4.55, w: 12, h: 0.35, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addText([
    { text: "58.2 % del test comparte video con el entrenamiento. ", options: { bold: true, color: INK } },
    { text: "Los baselines publicados premian memorizar escenas, no generalizar. Nuestra corrección: partir por video (fuga 0 %), manteniendo el split oficial solo por comparabilidad.", options: { color: GRIS } },
  ], { x: 0.6, y: 5.2, w: 12.1, h: 1.2, fontFace: F, fontSize: 15, margin: 0 });
  s.addText("Los otros seis: colisiones de nombres, rotaciones EXIF pendientes, duplicados val/test, marcos de anotación inconsistentes (H1–H3, H5–H7).",
    { x: 0.6, y: 6.55, w: 12.1, h: 0.6, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[11:50 – 12:50]

Antes de entrenar hice una auditoría de los tres datasets, y encontré siete defectos. El mayor es este.

Los splits oficiales de RoLID reparten frames del mismo video entre entrenamiento y test. Aquí ven cinco frames consecutivos de un mismo video: tres van a entrenamiento y dos a test. Como son frames consecutivos, son casi idénticos: medí 87 por ciento de redundancia visual con hashing perceptual.

El resultado es que el 58.2 por ciento de las imágenes de test comparte video de origen con el entrenamiento. El modelo no está generalizando: está recordando. Y eso significa que los baselines publicados sobre ese protocolo están inflados.

Mi corrección fue partir por video, con fuga cero, manteniendo además el split oficial para poder comparar contra la literatura. Más adelante voy a cuantificar exactamente cuánto infla.`);
}

// ═══ 17 · CONFIGURACIÓN EXPERIMENTAL (NUEVA) ═════════════════════════════════
{
  const s = contenido("Configuración experimental", "La propuesta");
  const bloques = [
    ["Datos y protocolo", [
      "Splits 70 / 15 / 15 conscientes de grupo",
      "unidad: grupo visual (pHash) o video de origen",
      "estratificación iterativa: toda clase a 15.0–15.1 % en test",
      "test tocado una sola vez, con los pesos de mejor validación",
    ], AZUL],
    ["Entrenamiento", [
      "warmup lineal del learning rate + recorte de gradiente",
      "50–150 épocas con early stopping (paciencia 8–30)",
      "checkpoints por época, reanudables",
      "semilla fija (42) y ejecución determinista",
    ], NARANJA],
    ["Entrada y aumentación", [
      "pool materializado a 1 280 px de lado máximo",
      "entrenamiento a 640 y 1 024 px (ablación)",
      "mosaic, flip horizontal, jitter HSV",
      "EXIF resuelto por imagen antes de entrenar",
    ], VERDE],
    ["Cómputo", [
      "Mac M-series (MPS): VGG, FCN y un YOLO",
      "Colab A100 (CUDA): los 5 Faster R-CNN y los YOLO pesados",
      "guardián de presupuesto: 20 h por experimento",
      "registro DONE / FAILED por corrida",
    ], ROJO],
  ];
  bloques.forEach(([t, items, c], i) => {
    const x = 0.6 + (i % 2) * 6.25, y = 1.75 + Math.floor(i / 2) * 2.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.95, h: 2.3,
      fill: { color: c, transparency: 92 }, line: { color: c, width: 1.3 }, rectRadius: 0.06 });
    s.addText(t, { x: x + 0.28, y: y + 0.14, w: 5.4, h: 0.42, fontFace: F, fontSize: 16,
      bold: true, color: INK, margin: 0 });
    s.addText(items.map((it, j) => ({ text: it,
      options: { bullet: true, breakLine: j < items.length - 1 } })),
      { x: x + 0.28, y: y + 0.6, w: 5.45, h: 1.6, fontFace: F, fontSize: 11.5,
        color: GRIS, margin: 0, paraSpaceAfter: 3, valign: "top" });
  });
  s.addText("Todo el protocolo es reejecutable desde el repositorio: los 19 experimentos, los splits congelados y los ground truths están publicados.",
    { x: 0.6, y: 6.95, w: 12.1, h: 0.4, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[12:50 – 13:40]

La configuración experimental, en concreto.

Los datos se parten 70-15-15 con conciencia de grupo: la unidad de partición no es la imagen, es el grupo visual o el video de origen. Uso estratificación iterativa, y eso deja a todas las clases entre 15.0 y 15.1 por ciento en test. Los ground truths quedan congelados y el conjunto de test se toca una sola vez por experimento, con los pesos de mejor validación.

En entrenamiento: warmup lineal del learning rate y recorte de gradiente —los dos vienen de un problema real que voy a mencionar—, topes de 50 a 150 épocas con early stopping, checkpoints por época que permiten reanudar, y semilla fija.

La entrada se materializa a 1 280 píxeles de lado máximo y se entrena a 640 o 1 024 según el experimento, con aumentación estándar.

Y el cómputo va en dos carriles con un guardián de presupuesto de veinte horas por experimento. Todo esto está publicado y es reejecutable.`);
}

// ═══ 18 · 19 EXPERIMENTOS ════════════════════════════════════════════════════
{
  const s = contenido("19 experimentos, 4 familias de modelos", "La propuesta");
  const familias = [
    ["VGG-16 · clasificación", ["E1", "E2", "E3", "E4"], VERDE, "2 estrategias × 2 lr"],
    ["FCN · segmentación", ["D1", "D2"], ROJO, "2 tasas de aprendizaje"],
    ["Faster R-CNN · detección", ["A1", "A2", "B6", "B5", "C"], AZUL, "congelado vs layer4 · 6/5 clases · dashcam"],
    ["YOLOv11n · detección", ["F1", "F2", "F3", "F4", "G1", "G2", "H1", "H2"], NARANJA, "4 dominios · 6/5 clases · 640 vs 1024 px"],
  ];
  familias.forEach(([fam, exps, c, d], i) => {
    const y = 1.85 + i * 1.3;
    s.addText(fam, { x: 0.6, y, w: 4.1, h: 0.45, fontFace: F, fontSize: 15, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 0.6, y: y + 0.44, w: 4.3, h: 0.4, fontFace: F, fontSize: 11,
      color: GRIS2, margin: 0 });
    exps.forEach((e, j) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.1 + j * 0.95, y: y + 0.02, w: 0.82, h: 0.55,
        fill: { color: c, transparency: 84 }, line: { color: c, width: 1.2 }, rectRadius: 0.08 });
      s.addText(e, { x: 5.1 + j * 0.95, y: y + 0.07, w: 0.82, h: 0.45, fontFace: F,
        fontSize: 12, bold: true, color: INK, align: "center", margin: 0 });
    });
  });
  s.addText("Los análisis que responden la pregunta: matriz cross-domain 3×3 · fuga oficial vs por-video · ablación de resolución · 6 vs 5 clases",
    { x: 0.6, y: 6.65, w: 12.1, h: 0.5, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addNotes(`[13:40 – 14:20]

El portafolio son diecinueve experimentos en cuatro familias.

Cuatro VGG, variando la estrategia de congelamiento y la tasa de aprendizaje. Dos FCN con distintas tasas. Cinco Faster R-CNN: dos estrategias de transferencia sobre TACO, dos variantes de taxonomía y uno sobre dashcam. Y ocho YOLO: cuatro dominios, dos taxonomías y dos resoluciones.

Esos diecinueve alimentan los cuatro análisis que responden la pregunta de investigación: la matriz cross-domain, la cuantificación de la fuga, la ablación de resolución y la comparación de granularidad de clases.`);
}

// ═══ 19 · INFRAESTRUCTURA (carriles + guardianes fusionados) ═════════════════
{
  const s = contenido("Cómputo y guardianes: decisiones automáticas, no opiniones", "El desarrollo");
  s.addText("95 s", { x: 0.9, y: 1.75, w: 2.6, h: 0.95, fontFace: F, fontSize: 46, bold: true,
    color: ROJO, margin: 0 });
  s.addText("por iteración de Faster R-CNN en la Mac (MPS): las entradas variables recompilan kernels de Metal en cada paso",
    { x: 0.9, y: 2.75, w: 3.0, h: 1.1, fontFace: F, fontSize: 12, color: GRIS, margin: 0 });
  s.addText("0.3 s", { x: 4.55, y: 1.75, w: 2.6, h: 0.95, fontFace: F, fontSize: 46, bold: true,
    color: VERDE, margin: 0 });
  s.addText("la misma iteración en una A100 de Colab: 300× más rápido",
    { x: 4.55, y: 2.75, w: 3.0, h: 1.1, fontFace: F, fontSize: 12, color: GRIS, margin: 0 });
  const g = [
    ["Presupuesto", "proyecta el costo total tras la primera época; si supera 20 h, aborta y deriva al otro carril", AZUL],
    ["NaN y cuarentena", "aísla divergencias y reintenta con configuración estable", NARANJA],
    ["Registro DONE / FAILED", "un fallo individual nunca detiene la ejecución completa", VERDE],
  ];
  g.forEach(([t, d, c], i) => {
    const y = 1.75 + i * 1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.0, y, w: 4.72, h: 1.35,
      fill: { color: c, transparency: 90 }, line: { color: c, width: 1.3 }, rectRadius: 0.06 });
    s.addText(t, { x: 8.28, y: y + 0.12, w: 4.2, h: 0.4, fontFace: F, fontSize: 14.5,
      bold: true, color: INK, margin: 0 });
    s.addText(d, { x: 8.28, y: y + 0.55, w: 4.2, h: 0.7, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
  });
  s.addText([
    { text: "Regla operativa de todas las notebooks: Run All, siempre. ", options: { bold: true, color: INK } },
    { text: "Lo terminado se salta, lo fallido se reintenta, lo interrumpido se reanuda desde su último checkpoint.", options: { color: GRIS } },
  ], { x: 0.9, y: 4.3, w: 6.6, h: 1.1, fontFace: F, fontSize: 13.5, margin: 0 });
  s.addText("Ejemplo real: el guardián expulsó un experimento de la Mac con una proyección de 25 h y lo derivó a Colab.",
    { x: 0.9, y: 5.5, w: 6.6, h: 0.8, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[14:20 – 15:10]

Dos cosas sobre el desarrollo.

La primera es una medición: una iteración sana de Faster R-CNN cuesta 95 segundos en la Mac contra 0.3 segundos en una A100 de Colab. Trescientas veces de diferencia. La causa es que MPS recompila kernels de Metal por cada forma de entrada distinta, y Faster R-CNN trabaja con entradas de tamaño variable.

La segunda es que convertí eso en una regla automática. Un guardián de presupuesto proyecta el costo total después de la primera época y, si supera veinte horas, aborta el experimento y me indica moverlo al otro carril. Hay un guardián de NaN que aísla divergencias en cuarentena —eso vino de una corrida que divergió y registró once épocas en NaN como si nada— y un registro DONE/FAILED que hace que un fallo individual nunca detenga la ejecución completa.

La regla operativa de todas las notebooks es: Run All, siempre. Eso es lo que permitió entrenar durante días sin supervisión.`);
}

// ═══ 20 · CURVAS ═════════════════════════════════════════════════════════════
{
  const s = contenido("El entrenamiento, gobernado y visible", "Resultados");
  await fit(s, FP1("p1_curvas.png"), 0.6, 1.75, 12.1, 4.3);
  s.addText([
    { text: "Convergencia limpia en las 8 corridas YOLO. ", options: { bold: true, color: INK } },
    { text: "El early stopping corta cuando la validación deja de mejorar (F2 en la época 93, G2 en la 148) y la separación entre curvas ya anticipa el resultado: el dominio y la resolución mandan.", options: { color: GRIS } },
  ], { x: 0.6, y: 6.2, w: 12.1, h: 0.9, fontFace: F, fontSize: 14, margin: 0 });
  s.addNotes(`[15:10 – 15:45]

Esta es la evidencia de que el entrenamiento estuvo gobernado.

Son las ocho corridas de YOLO: convergencia limpia, y el early stopping cortando cuando la validación deja de mejorar. F2 se detiene en la época 93, G2 en la 148.

Y ya se anticipa algo en la separación de las curvas: el dominio y la resolución importan más que cualquier otro factor. Las corridas de dashcam a 1 024 píxeles van claramente arriba.`);
}

// ═══ 21 · LOS 4 NÚMEROS ══════════════════════════════════════════════════════
{
  const s = contenido("Cuatro números que responden la pregunta", "Resultados");
  const nums = [
    ["−82 %", "de mAP50 al cruzar dominios: los detectores no viajan"],
    ["+21 %", "de inflación de AP50 por la fuga del split oficial"],
    ["+8.3", "puntos de AP50 en dashcam solo por subir a 1024 px"],
    ["16×", "menos parámetros (YOLO) quedando a 1–4 puntos del grande"],
  ];
  nums.forEach(([n, t], i) => {
    const x = 0.6 + (i % 2) * 6.35, y = 1.95 + Math.floor(i / 2) * 2.4;
    s.addText(n, { x, y, w: 5.8, h: 1.05, fontFace: F, fontSize: 54, bold: true,
      color: NARANJA, margin: 0 });
    s.addText(t, { x, y: y + 1.1, w: 5.8, h: 0.8, fontFace: F, fontSize: 15,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[15:45 – 16:20]

Los resultados en cuatro números.

Menos 82 por ciento de mAP50 al cruzar dominios: los detectores no viajan.

Más 21 por ciento de inflación por la fuga del split oficial.

Más 8.3 puntos solo por subir la resolución a 1 024 en dashcam.

Y un modelo dieciséis veces más chico que queda a uno o cuatro puntos del grande.

Los desgloso uno por uno.`);
}

// ═══ 22 · MATRIZ ═════════════════════════════════════════════════════════════
{
  const s = contenido("Los detectores no viajan", "Resultados · matriz cross-domain");
  await fit(s, FF("matriz_cross_domain_final.png"), 0.5, 1.75, 8.3, 4.6);
  s.addText([
    { text: "In-domain: 0.639 de media.\nCruzado: 0.118. ", options: { bold: true, color: INK } },
    { text: "\nDashcam es una isla (≤ 0.064 en ambas direcciones): su objeto de 22 px cae bajo el ancla mínima de 32.\n\n", options: { color: GRIS } },
    { text: "Mano → dron retiene el 68 %: ", options: { bold: true, color: INK } },
    { text: "la escala del objeto, no la apariencia, domina la brecha.", options: { color: GRIS } },
  ], { x: 9.0, y: 2.0, w: 3.75, h: 4.4, fontFace: F, fontSize: 14, margin: 0 });
  s.addNotes(`[16:20 – 17:20]

El resultado central. Filas: dominio de entrenamiento. Columnas: dominio de test.

La diagonal es in-domain y promedia 0.639. Fuera de la diagonal, 0.118. Una caída del 82 por ciento.

Pero lo verdaderamente interesante es la asimetría. Dashcam es una isla: en ambas direcciones no pasa de 0.064. En cambio, mano a dron retiene el 68 por ciento del rendimiento.

¿Por qué? Vuelvo a las anclas. TACO y UAVVaste tienen objetos de 171 y 72 píxeles: ambos dentro del rango de anclas del preentrenamiento. Dashcam, con 22 píxeles, está fuera. Es la escala del objeto, no la apariencia, lo que domina la brecha. Y eso responde la primera parte de la pregunta de investigación.`);
}

// ═══ 23 · FUGA ═══════════════════════════════════════════════════════════════
{
  const s = contenido("La higiene del split cambia las conclusiones", "Resultados · fuga H4");
  await fit(s, FF("fuga_oficial_vs_video.png"), 0.5, 1.75, 7.6, 4.6);
  s.addText([
    { text: "Sobre el mismo test limpio:\n", options: { color: GRIS } },
    { text: "0.844 vs 0.695. ", options: { bold: true, fontSize: 22, color: ROJO } },
    { text: "\nEl modelo que entrenó con frames de los videos del test parece +21 % mejor — memorizó escenas, no aprendió a generalizar.\n\n", options: { color: GRIS } },
    { text: "Partir por video elimina el sesgo a costo cero.", options: { bold: true, color: INK } },
  ], { x: 8.4, y: 2.0, w: 4.3, h: 4.4, fontFace: F, fontSize: 14, margin: 0 });
  s.addNotes(`[17:20 – 18:10]

La cuantificación de la fuga. Tres barras, todas sobre RoLID.

La primera: modelo entrenado con el split oficial, evaluado en el test oficial. 0.620.

La segunda: modelo entrenado limpio, por video, evaluado en su test limpio. 0.695.

Y la tercera es la clave: el modelo entrenado con el split oficial —el que vio frames de los videos del test— evaluado sobre el test limpio. 0.844.

Comparen las dos últimas: mismo conjunto de evaluación, quince puntos de diferencia, veintiuno por ciento relativo. Esa diferencia no es aprendizaje, es memoria de escena.

Y lo importante para la comunidad: corregirlo no cuesta absolutamente nada, solo partir por video. Publiqué los splits corregidos para que otros trabajos puedan usarlos.`);
}

// ═══ 24 · RESOLUCIÓN ═════════════════════════════════════════════════════════
{
  const s = contenido("La resolución paga donde los objetos son pequeños", "Resultados · ablación 640 → 1024");
  await fit(s, FF("ablacion_resolucion.png"), 0.5, 1.85, 9.2, 3.6);
  s.addText([
    { text: "Dashcam: +8.3 AP50, +5.8 AP-small.\n", options: { bold: true, color: INK } },
    { text: "Mano: +3.2 y +3.9.\n\n", options: { color: GRIS } },
    { text: "La palanca más barata del problema: sin tocar el modelo, solo la entrada.", options: { color: GRIS } },
  ], { x: 10.0, y: 2.2, w: 2.75, h: 3.5, fontFace: F, fontSize: 13.5, margin: 0 });
  s.addNotes(`[18:10 – 18:50]

La ablación de resolución, que responde la segunda parte de la pregunta.

Al pasar de 640 a 1 024 píxeles, dashcam gana 8.3 puntos de AP50 y 5.8 de AP-small. Mano gana 3.2 y 3.9.

La ganancia se concentra exactamente donde los objetos son más pequeños, que es justo lo que predice el argumento de las anclas: al duplicar la resolución, un objeto de 22 píxeles pasa a medir 35 y entra en el rango que el modelo puede ver.

Es la palanca más barata del problema: no cambié el modelo, solo la entrada.`);
}

// ═══ 25 · FAMILIAS + TIDE ════════════════════════════════════════════════════
{
  const s = contenido("Las familias, comparadas con la misma vara", "Resultados · familias y anatomía del error");
  await fit(s, FF("comparativa_familias.png"), 0.5, 1.8, 6.3, 3.3);
  await fit(s, FF("tide_descomposicion.png"), 7.0, 1.8, 5.9, 3.3);
  s.addText([
    { text: "YOLOv11n queda a 1–4 puntos de Faster R-CNN en 1 clase con 16× menos parámetros — el despliegue ligero es viable. ", options: { color: GRIS } },
    { text: "Y TIDE revela el hallazgo contraintuitivo: los modelos dashcam casi no fallan por objetos perdidos (Miss ≤ 3.9): los objetos de 22 px sí se encuentran. ", options: { bold: true, color: INK } },
    { text: "En multiclase el cuello de botella es nombrar el material (hasta 24.6 dAP), no localizarlo.", options: { color: GRIS } },
  ], { x: 0.6, y: 5.35, w: 12.1, h: 1.5, fontFace: F, fontSize: 14, margin: 0 });
  s.addNotes(`[18:50 – 19:50]

Dos mensajes finales de resultados.

A la izquierda, las familias comparadas con la misma vara: YOLOv11n queda a uno o cuatro puntos de Faster R-CNN en tareas de una sola clase, con dieciséis veces menos parámetros. El despliegue ligero es viable, y eso responde la tercera parte de la pregunta: la arquitectura pesa menos de lo que uno esperaría.

A la derecha, TIDE. Y aquí está el hallazgo que no esperaba: los modelos de dashcam in-domain casi no pierden por objetos no detectados; el término Miss no pasa de 3.9. Es decir, los objetos de 22 píxeles sí se encuentran.

Eso reencuadra el problema: el colapso al cruzar dominios no viene de un piso de recall irrecuperable, viene de las representaciones. Y en multiclase el cuello de botella es nombrar el material, no localizarlo: hasta 24.6 puntos de dAP en clasificación contra 1.7 en localización.`);
}

// ═══ 26 · LIMITACIONES Y RETOS (NUEVA) ═══════════════════════════════════════
{
  const s = contenido("Limitaciones y retos", "Cierre analítico");
  s.addText("Limitaciones del estudio", { x: 0.6, y: 1.7, w: 5.9, h: 0.4, fontFace: F,
    fontSize: 16, bold: true, color: ROJO, margin: 0 });
  const lim = [
    "Las cifras absolutas son estructuralmente bajas: TrashDet, con búsqueda de arquitectura dedicada, reporta 19.5 mAP50 en un subconjunto comparable",
    "Sin detectores transformer (CO-DETR), excluidos por presupuesto de cómputo",
    "StreetView-Waste inaccesible: sus enlaces devuelven HTTP 401",
    "La brecha geográfica quedó sin medir: el set propio de Lima está pendiente",
    "Las imágenes de la demo son descargas web sin anotación: evidencia cualitativa, no métrica",
  ];
  s.addText(lim.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < lim.length - 1 } })),
    { x: 0.6, y: 2.2, w: 5.9, h: 4.3, fontFace: F, fontSize: 12.5, color: GRIS,
      margin: 0, paraSpaceAfter: 8, valign: "top" });
  s.addText("Retos superados", { x: 6.9, y: 1.7, w: 5.9, h: 0.4, fontFace: F,
    fontSize: 16, bold: true, color: VERDE, margin: 0 });
  const ret = [
    "Brecha de cómputo de 300× entre carriles: resuelta con proyección automática de presupuesto",
    "Bug intermitente de la librería sobre MPS que abortó tres entrenamientos largos: migración a CUDA",
    "Corrupción silenciosa de una evaluación: detectada validando el volumen de predicciones, no la ausencia de excepciones",
    "Saturación de memoria unificada al inferir por lotes: rediseño a inferencia secuencial con liberación explícita",
  ];
  s.addText(ret.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < ret.length - 1 } })),
    { x: 6.9, y: 2.2, w: 5.9, h: 4.3, fontFace: F, fontSize: 12.5, color: GRIS,
      margin: 0, paraSpaceAfter: 8, valign: "top" });
  s.addNotes(`[19:50 – 20:40]

Las limitaciones, con honestidad.

Las cifras absolutas de este problema son estructuralmente bajas. Como referencia: TrashDet, publicado este año con búsqueda de arquitectura dedicada, reporta 19.5 de mAP50 en un subconjunto comparable de TACO; yo obtengo 19.2 sin ninguna búsqueda. No es que el modelo esté mal: el problema es duro.

No incluí detectores transformer por presupuesto de cómputo. StreetView-Waste no se pudo descargar: sus enlaces devuelven error 401 y escribí a los autores sin respuesta. La brecha geográfica quedó sin medir, porque el set propio de Lima está pendiente. Y las imágenes de la demo son descargas de internet sin anotación, así que son evidencia cualitativa, no métrica.

En cuanto a retos: la brecha de cómputo de trescientas veces; un bug intermitente de la librería sobre MPS que mató tres entrenamientos largos; una corrupción silenciosa que solo detecté validando el volumen de predicciones —una corrida que terminó sin errores y estaba produciendo basura—; y un reinicio de la máquina por saturación de memoria unificada, que me obligó a rediseñar la inferencia de la demo.`);
}

// ═══ 27 · LECCIONES APRENDIDAS ═══════════════════════════════════════════════
{
  const s = contenido("Lecciones aprendidas", "Cierre analítico");
  const lec = [
    ["Auditar antes de entrenar", "una fuga escondida reescribe un benchmark; encontrarla costó una fracción de lo que costaba ignorarla"],
    ["Una sola fuente de verdad métrica", "evaluar todo con el mismo contrato es lo que vuelve comparables las familias — y lo que delata números imposibles"],
    ["Los guardianes convierten fallos en decisiones", "presupuesto, NaN y cuarentena transformaron noches de cómputo incierto en registros auditables"],
    ["Validar el volumen de las predicciones", "una corrida puede terminar sin excepciones y aún así estar corrupta; el volumen y la coherencia lo delatan"],
  ];
  lec.forEach(([t, d], i) => {
    const y = 1.8 + i * 1.25;
    s.addText(String(i + 1).padStart(2, "0"), { x: 0.6, y, w: 0.8, h: 0.55,
      fontFace: F, fontSize: 24, bold: true, color: NARANJA, margin: 0 });
    s.addText(t, { x: 1.55, y, w: 11.0, h: 0.45, fontFace: F, fontSize: 17, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 1.55, y: y + 0.45, w: 11.2, h: 0.6, fontFace: F, fontSize: 13,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[20:40 – 21:20]

Cuatro lecciones que me llevo.

Auditar antes de entrenar: encontrar la fuga costó una fracción de lo que habría costado ignorarla y publicar resultados inflados.

Una sola fuente de verdad métrica: es lo que hace comparables las familias entre sí, y también lo que delata números imposibles cuando algo sale mal.

Los guardianes convierten fallos en decisiones: transformaron noches de cómputo incierto en registros auditables que puedo mostrar.

Y la cuarta, que es la que más me marcó: validar el volumen de las predicciones, no la ausencia de errores. Una corrida puede terminar sin excepciones y estar corrupta. Me pasó, y solo lo detecté porque el número de detecciones era siete veces menor de lo normal.`);
}

// ═══ 28 · CONCLUSIONES ═══════════════════════════════════════════════════════
{
  const s = contenido("Conclusiones y trabajo futuro");
  const conc = [
    "Aún no existe un modelo universal de basura: el ajuste por dominio — o al menos la adaptación de resolución — sigue siendo obligatorio para un despliegue con sensores mixtos.",
    "La higiene de los datos cambia conclusiones: los datasets con estructura de video deberían publicar identificadores de grupo.",
    "Detectar agnóstico a la clase y clasificar recortes: la anatomía del error sugiere desacoplar las dos tareas.",
  ];
  conc.forEach((t, i) => {
    s.addText([{ text: "—  ", options: { bold: true, color: NARANJA } },
               { text: t, options: { color: INK } }],
      { x: 0.6, y: 1.9 + i * 1.0, w: 12.1, h: 0.9, fontFace: F, fontSize: 16, margin: 0 });
  });
  s.addText("Trabajo futuro", { x: 0.6, y: 5.15, w: 6, h: 0.4, fontFace: F, fontSize: 15,
    bold: true, color: GRIS, margin: 0 });
  s.addText("detectores transformer (CO-DETR) · agregación temporal sobre video de dashcam · set propio Lima-OOD (protocolo listo) · tiling para objetos pequeños · despliegue en el borde del modelo de 2.6 M",
    { x: 0.6, y: 5.6, w: 12.1, h: 0.85, fontFace: F, fontSize: 14, color: GRIS, margin: 0 });
  s.addNotes(`[21:20 – 22:00]

Tres conclusiones.

Primero: aún no existe un modelo universal de basura. Para una ciudad que despliega sensores mixtos, el ajuste por dominio —o al menos la adaptación de resolución— sigue siendo obligatorio.

Segundo: la higiene de los datos cambia conclusiones. Los datasets con estructura de video deberían publicar identificadores de grupo para que nadie repita esta fuga.

Tercero: la anatomía del error sugiere desacoplar detección y clasificación de material, en lugar de seguir refinando cabezas de detección cada vez más complejas.

Como trabajo futuro: detectores transformer, agregación temporal sobre el video de dashcam —que es la señal que un detector por frame desperdicia—, el set propio de Lima para medir la brecha geográfica, y despliegue en el borde.`);
}

// ═══ 29 · DEMO: PASOS ════════════════════════════════════════════════════════
{
  const s = contenido("Demostración en vivo", "Demostración");
  const pasos = [
    ["1", "Descargar", "imágenes de basura de internet, ahora mismo"],
    ["2", "Soltar", "en una carpeta nueva: demo/input/en_vivo/"],
    ["3", "Run All", "los cuatro modelos procesan el lote completo"],
  ];
  pasos.forEach(([n, t, d], i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.shapes.OVAL, { x: x + 1.45, y: 2.0, w: 1.0, h: 1.0,
      fill: { color: NARANJA, transparency: 85 }, line: { color: NARANJA, width: 1.6 } });
    s.addText(n, { x: x + 1.45, y: 2.13, w: 1.0, h: 0.75, fontFace: F, fontSize: 28,
      bold: true, color: INK, align: "center", margin: 0 });
    s.addText(t, { x, y: 3.25, w: 3.9, h: 0.5, fontFace: F, fontSize: 19, bold: true,
      color: INK, align: "center", margin: 0 });
    s.addText(d, { x: x + 0.3, y: 3.75, w: 3.3, h: 0.8, fontFace: F, fontSize: 13,
      color: GRIS, align: "center", margin: 0 });
  });
  s.addText("Salida: collages por modelo, la misma imagen comparada entre los cuatro, indicadores y tabla resumen — todo guardado en demo/output/.",
    { x: 0.6, y: 5.1, w: 12.1, h: 0.6, fontFace: F, fontSize: 14, color: GRIS, margin: 0 });
  s.addText("Imágenes nunca vistas por los modelos: la degradación fuera de dominio que medimos también estará a la vista.",
    { x: 0.6, y: 5.85, w: 12.1, h: 0.5, fontFace: F, fontSize: 13, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[22:00 – 22:20]  → SALIR DE LA PRESENTACIÓN

En lugar de contarles que el proyecto es reproducible, se los muestro.

Voy a descargar imágenes de basura de internet en este momento, las voy a dejar en una carpeta, y voy a ejecutar la notebook completa. Los cuatro modelos procesan todo el lote.

Son imágenes que los modelos nunca han visto, así que la degradación fuera de dominio que acabo de medir también va a estar a la vista.

[ACCIÓN: salir a la notebook 07 · crear demo/input/en_vivo/ · Run All]
[Mientras corre, narrar: primero YOLO sobre el lote, luego Faster R-CNN imagen por imagen, la máscara del FCN y por último Grad-CAM]
[Plan B si falla la conexión: pasar a la siguiente lámina, que muestra una sesión ya ejecutada]`);
}

// ═══ 30 · DEMO: RESPALDO ═════════════════════════════════════════════════════
{
  const s = contenido("La misma imagen, vista por los cuatro modelos", "Demostración · sesión de referencia");
  await fit(s, A("strip_respaldo1.jpg"), 0.5, 1.85, 12.35, 2.3);
  await fit(s, A("strip_respaldo2.jpg"), 0.5, 4.3, 12.35, 2.3);
  s.addText("Sesión test_01 (10 imágenes web): original · YOLOv11n · Faster R-CNN · FCN · Grad-CAM",
    { x: 0.6, y: 6.75, w: 12.1, h: 0.4, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[22:20 – 24:30]  (durante y después de la demo)

Esto es lo que produce el sistema: por cada imagen, una tira con el original, las detecciones de YOLO, las de Faster R-CNN, la máscara del FCN y la explicación de Grad-CAM.

Fíjense en el contraste de densidad entre las dos columnas de detección: Faster R-CNN propone consistentemente más candidatos que YOLO. Es exactamente el mismo patrón que mostraban las tablas cuantitativas, ahora sobre imágenes que ningún modelo vio durante el entrenamiento.

El recuadro punteado del original marca de dónde sale el recorte que analiza Grad-CAM.`);
}

// ═══ 31 · GRACIAS ════════════════════════════════════════════════════════════
{
  const s = base(true);
  logoOscuro(s, 12.25, 0.5, 0.6);
  s.addText("Gracias", { x: 0.7, y: 2.3, w: 11.9, h: 1.1, fontFace: F, fontSize: 54,
    bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Preguntas y discusión", { x: 0.7, y: 3.5, w: 11.9, h: 0.6, fontFace: F,
    fontSize: 22, color: "C9C9C4", margin: 0 });
  s.addText([
    { text: "Código, pesos y datos:  ", options: { color: "9A9A92" } },
    { text: "github.com/jairzinhosantos/how-far-does-a-litter-detector-travel", options: { color: "7DB4EA" } },
  ], { x: 0.7, y: 4.6, w: 12.0, h: 0.4, fontFace: F, fontSize: 14, margin: 0 });
  s.addText("Jairzinho Santos · Universidad Nacional de Ingeniería · 2026-I",
    { x: 0.7, y: 5.1, w: 11.9, h: 0.4, fontFace: F, fontSize: 12, color: "9A9A92", margin: 0 });
  s.addNotes(`[24:30 – 25:00]

Eso es todo. El código, los pesos entrenados, los datos y todas las notebooks están públicos en el repositorio, junto con los splits corregidos para que otros trabajos puedan reutilizarlos.

Muchas gracias, y quedo atento a sus preguntas.

[Las láminas del apéndice cubren: rendimiento multiclase, por qué no transformers, detalle de la fuga, escala de objetos e interpretabilidad por dominio]`);
}

// ═══ APÉNDICE ════════════════════════════════════════════════════════════════
{
  const s = base(true);
  logoOscuro(s, 12.25, 0.5, 0.6);
  s.addText("Apéndice", { x: 0.7, y: 3.1, w: 11.9, h: 0.9, fontFace: F, fontSize: 40,
    bold: true, color: "FFFFFF", margin: 0 });
  s.addText("material de soporte para preguntas", { x: 0.7, y: 4.05, w: 11.9, h: 0.5,
    fontFace: F, fontSize: 16, color: "9A9A92", margin: 0 });
  s.addNotes("Separador. No se muestra durante la exposición; se navega solo si una pregunta lo pide.");
}
{
  const s = contenido("Sobre el rendimiento multiclase (0.15–0.25)", "Apéndice");
  s.addText([
    { text: "Las cifras absolutas del problema son estructuralmente bajas: ", options: { color: GRIS } },
    { text: "TrashDet (WACV-W 2026), con búsqueda de arquitectura dedicada, reporta 19.5 mAP50 en un subconjunto comparable de TACO — nuestro 5 clases da 19.2 sin búsqueda alguna.\n\n", options: { bold: true, color: INK } },
    { text: "TIDE muestra que el error dominante es de clasificación (hasta 24.6 dAP) y no de localización (1.7): ", options: { color: GRIS } },
    { text: "encontrar la basura no es el cuello de botella; nombrar su material sí.", options: { bold: true, color: INK } },
  ], { x: 0.6, y: 1.9, w: 12.1, h: 2.3, fontFace: F, fontSize: 15, margin: 0 });
  await fit(s, FF("variantes_ab.png"), 1.6, 4.15, 10.1, 3.0);
  s.addNotes("Respuesta a: ¿por qué el multiclase rinde tan bajo? Anclar en TrashDet (19.5 vs nuestro 19.2) y en la descomposición TIDE: el error es de clasificación, no de detección.");
}
{
  const s = contenido("Sobre los detectores transformer", "Apéndice");
  s.addText([
    { text: "CO-DETR y afines lideran el benchmark in-domain de RoLID por más de 20 puntos de AP50. ", options: { bold: true, color: INK } },
    { text: "Quedaron fuera por presupuesto de cómputo (regla de 20 h por experimento) y porque el objetivo del proyecto es la cantidad relativa — la degradación entre dominios — que es robusta a la elección de arquitectura.\n\nEstán declarados como primera línea del trabajo futuro.", options: { color: GRIS } },
  ], { x: 0.6, y: 1.9, w: 12.1, h: 2.5, fontFace: F, fontSize: 15, margin: 0 });
  await fit(s, FP1("p1_curvas.png"), 1.6, 4.3, 10.1, 2.9);
  s.addNotes("Respuesta a: ¿por qué no transformers? Presupuesto de cómputo, y el objetivo es la degradación relativa, robusta a la arquitectura. Declarado en trabajo futuro.");
}
{
  const s = contenido("Detalle de la fuga H4", "Apéndice");
  s.addText([
    { text: "22 de 84 videos de origen reparten frames en más de un split oficial. ", options: { bold: true, color: INK } },
    { text: "El 58.2 % de los frames de test comparte video con el entrenamiento, y el 87 % de los pares intra-video son casi duplicados por hash perceptual.\n\n", options: { color: GRIS } },
    { text: "Corrección: ", options: { bold: true, color: INK } },
    { text: "split por video (fuga 0 %, anotaciones 70/15/15) publicado como asset reutilizable (audited_splits.zip) en el Release del repositorio.", options: { color: GRIS } },
  ], { x: 0.6, y: 1.9, w: 12.1, h: 2.4, fontFace: F, fontSize: 15, margin: 0 });
  await fit(s, FF("fuga_oficial_vs_video.png"), 2.6, 4.35, 8.1, 2.85);
  s.addNotes("Respuesta a: ¿cómo detectaste la fuga y cómo la corregiste? 22 de 84 videos cruzan splits; corrección publicada como asset reutilizable.");
}
{
  const s = contenido("La escala del objeto separa los dominios", "Apéndice");
  await fit(s, FF("escala_objetos.png"), 1.3, 1.85, 10.7, 4.5);
  s.addText("Distribución acumulada del lado del objeto por dominio; la mediana de RoLID (22 px) cae bajo el ancla FPN mínima de 32 px.",
    { x: 0.6, y: 6.55, w: 12.1, h: 0.5, fontFace: F, fontSize: 13, italic: true, color: GRIS2, margin: 0 });
  s.addNotes("Respuesta a: ¿cómo sustentas que la escala es la causa? Esta CDF muestra que casi el 80 % de los objetos de dashcam está por debajo del ancla mínima.");
}
{
  const s = contenido("Interpretabilidad por dominio", "Apéndice");
  await fit(s, FF("cam_panel_paper.png"), 3.4, 1.8, 6.5, 4.9);
  s.addText("Una fila por dominio (dashcam, mano, dron): Grad-CAM y Guided Backpropagation concentran la activación en el objeto, incluso en recortes de 22 px.",
    { x: 0.6, y: 6.85, w: 12.1, h: 0.5, fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  s.addNotes("Respuesta a: ¿cómo verificas que la red no aprende el fondo? Grad-CAM y Guided BP por dominio muestran activación sobre el objeto.");
}

await pres.writeFile({ fileName: path.join(__dirname, "presentacion.pptx") });
console.log("presentacion.pptx generada");
})();

function RE_LINE() { return "E6E5E0"; }
