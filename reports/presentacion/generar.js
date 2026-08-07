// Presentación de defensa v2 — ¿Qué tan lejos viaja un detector de basura?
// node generar_v2.js  →  presentacion.pptx
// Estilo: granate institucional UNI + acentos tipo Google · diagramas nativos PPT
// Cada lámina lleva speech con marca de tiempo y ritmo [ANCLA] / [PASO]
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const path = require("path");

const A = p => path.join(__dirname, "assets", p);
const LOGO = A("uni_logo.png");
const LOGO_AR = 1200 / 1509;

// ── paleta ───────────────────────────────────────────────────────────────────
const GRANATE = "800404", GRANATE_CLARO = "A63A3A";
const AZUL = "3B6FD4", ROJO = "D64A3F", AMBAR = "E9A825", VERDE = "2E9E5B";
const AZUL_S = "8AB4F8", MORADO = "9B72CF";
const INK = "202124", GRIS = "5F6368", GRIS2 = "9AA0A6", REJILLA = "E8EAED";
const BG = "FFFFFF", BG_SUAVE = "F8F9FA";
const F = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

// ── helpers ──────────────────────────────────────────────────────────────────
async function dim(f) { const m = await sharp(f).metadata(); return { w: m.width, h: m.height }; }
async function fit(s, file, x, y, bw, bh, opts = {}) {
  const { w, h } = await dim(file);
  const r = Math.min(bw / w, bh / h), iw = w * r, ih = h * r;
  s.addImage({ path: file, x: x + (bw - iw) / 2, y: y + (bh - ih) / 2, w: iw, h: ih, ...opts });
}
function slideBase(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? INK : BG };
  return s;
}
function logoTop(s) {
  const h = 0.42, w = h * LOGO_AR;
  s.addImage({ path: LOGO, x: 12.66, y: 0.28, w, h });
}
function logoBadge(s, x, y, alto) {
  const w = alto * LOGO_AR, p = alto * 0.18;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - p, y: y - p, w: w + p * 2, h: alto + p * 2,
    fill: { color: BG }, line: { color: BG, width: 0.5 }, rectRadius: 0.06 });
  s.addImage({ path: LOGO, x, y, w, h: alto });
}
function L(titulo, kicker, sub) {
  const s = slideBase(false);
  if (kicker) s.addText(kicker.toUpperCase(), { x: 0.62, y: 0.34, w: 8, h: 0.28,
    fontFace: F, fontSize: 10.5, color: GRANATE, bold: true, charSpacing: 2.2, margin: 0 });
  s.addText(titulo, { x: 0.6, y: kicker ? 0.58 : 0.42, w: 11.6, h: 0.72,
    fontFace: F, fontSize: 27, color: INK, bold: true, margin: 0 });
  if (sub) s.addText(sub, { x: 0.62, y: 1.28, w: 11.6, h: 0.42,
    fontFace: F, fontSize: 13.5, color: GRIS, margin: 0 });
  logoTop(s);
  return s;
}
function Sec(num, titulo, bajada) {
  const s = slideBase(true);
  logoBadge(s, 12.15, 0.5, 0.62);
  s.addText(num, { x: 0.9, y: 2.35, w: 2.2, h: 1.5, fontFace: F, fontSize: 84,
    bold: true, color: GRANATE_CLARO, margin: 0 });
  s.addText(titulo, { x: 3.15, y: 2.55, w: 9.2, h: 0.95, fontFace: F, fontSize: 36,
    bold: true, color: BG, margin: 0 });
  s.addText(bajada, { x: 3.2, y: 3.55, w: 9.0, h: 0.8, fontFace: F, fontSize: 15,
    color: "BDC1C6", margin: 0 });
  return s;
}
function card(s, x, y, w, h, color, titulo, cuerpo, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h,
    fill: { color: BG_SUAVE }, line: { color, width: 1.6 }, rectRadius: 0.05 });
  if (titulo) s.addText(titulo, { x: x + 0.24, y: y + 0.16, w: w - 0.48, h: 0.42,
    fontFace: F, fontSize: opts.tf || 14.5, bold: true, color: opts.tc || INK, margin: 0 });
  if (cuerpo) s.addText(cuerpo, { x: x + 0.24, y: y + (titulo ? 0.62 : 0.2),
    w: w - 0.48, h: h - (titulo ? 0.8 : 0.4), fontFace: F, fontSize: opts.bf || 12,
    color: opts.bc || GRIS, margin: 0, valign: "top" });
}
function flecha(s, x, y, w) {
  s.addText("→", { x, y, w, h: 0.4, fontFace: F, fontSize: 20, color: GRIS2,
    align: "center", margin: 0 });
}
function cifra(s, x, y, w, valor, etiqueta, color) {
  s.addText(valor, { x, y, w, h: 0.95, fontFace: F, fontSize: 40, bold: true, color, margin: 0 });
  s.addText(etiqueta, { x, y: y + 0.92, w, h: 0.75, fontFace: F, fontSize: 12,
    color: GRIS, margin: 0, valign: "top" });
}
function pie(s, txt) {
  s.addText(txt, { x: 0.62, y: 6.86, w: 12.1, h: 0.34, fontFace: F, fontSize: 10,
    italic: true, color: GRIS2, margin: 0 });
}
function lista(s, items, x, y, w, h, fs = 12.5) {
  s.addText(items.map((t, i) => ({ text: t,
    options: { bullet: true, breakLine: i < items.length - 1 } })),
    { x, y, w, h, fontFace: F, fontSize: fs, color: GRIS, margin: 0,
      valign: "top", paraSpaceAfter: 7 });
}

(async () => {

// ═══ 0 · APERTURA ════════════════════════════════════════════════════════════
{
  const s = slideBase(true);
  await fit(s, A("portada_strip.jpg"), 0.45, 4.9, 12.45, 2.0);
  logoBadge(s, 11.85, 0.55, 0.92);
  s.addText("¿Qué tan lejos viaja\nun detector de basura?", { x: 0.72, y: 1.25, w: 10.5, h: 2.0,
    fontFace: F, fontSize: 40, bold: true, color: BG, margin: 0, lineSpacing: 46 });
  s.addText("Detección cross-domain de residuos urbanos en imágenes de mano, dashcam y dron",
    { x: 0.75, y: 3.35, w: 11.0, h: 0.5, fontFace: F, fontSize: 17, color: "BDC1C6", margin: 0 });
  s.addText([{ text: "Jairzinho Santos", options: { bold: true, color: BG } },
             { text: "   ·   Visión Computacional · Maestría en Inteligencia Artificial", options: { color: "9AA0A6" } }],
    { x: 0.75, y: 4.05, w: 11.5, h: 0.4, fontFace: F, fontSize: 13.5, margin: 0 });
  s.addText("Universidad Nacional de Ingeniería  ·  2026-I", { x: 0.75, y: 4.42, w: 8, h: 0.35,
    fontFace: F, fontSize: 11.5, color: "9AA0A6", margin: 0 });
  s.addNotes(`[00:00 – 00:45]  [ANCLA]

Buenos días. Mi nombre es Jairzinho Santos y voy a presentar mi proyecto final del curso de Visión Computacional.

El título es una pregunta: ¿qué tan lejos viaja un detector de basura? Y la pregunta es literal. Imaginen una ciudad que quiere monitorear sus residuos: recibe fotos de los vecinos desde el celular, tiene cámaras en los camiones recolectores, y usa drones para las zonas difíciles. Tres formas distintas de ver exactamente el mismo problema.

La pregunta que me hice es: si entreno un detector con una de esas fuentes, ¿sirve para las otras? Eso es lo que vine a medir.`);
}
{
  const s = L("Agenda");
  const bloques = [
    ["01", "El problema y de dónde nace", "el contexto, los datasets publicados y la pregunta"],
    ["02", "Vocabulario del proyecto", "los términos y la nomenclatura que voy a usar"],
    ["03", "Las herramientas y su justificación", "qué modelos elegí y por qué esos"],
    ["04", "Cómo se mide", "las métricas de detección, paso a paso"],
    ["05", "La propuesta y el desarrollo", "pipeline, auditoría, configuración y cómputo"],
    ["06", "Resultados", "los cuatro hallazgos"],
    ["07", "Cierre", "limitaciones, retos, lecciones y trabajo futuro"],
    ["08", "Demostración en vivo", "el sistema corriendo con imágenes nuevas"],
  ];
  bloques.forEach(([n, t, d], i) => {
    const col = i < 4 ? 0 : 1, y = 1.75 + (i % 4) * 1.26;
    const x = 0.7 + col * 6.3;
    s.addText(n, { x, y, w: 0.7, h: 0.5, fontFace: F, fontSize: 21, bold: true,
      color: GRANATE, margin: 0 });
    s.addText(t, { x: x + 0.75, y: y - 0.02, w: 5.2, h: 0.45, fontFace: F, fontSize: 15.5,
      bold: true, color: INK, margin: 0 });
    s.addText(d, { x: x + 0.75, y: y + 0.42, w: 5.2, h: 0.5, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[00:45 – 01:10]  [PASO]

El recorrido: primero el problema y de dónde nace la pregunta. Después dedico un momento al vocabulario, porque voy a usar términos y códigos que conviene fijar desde el inicio.

Luego las herramientas —qué modelos elegí y por qué esos y no otros—, cómo se mide en detección de objetos, la propuesta y el desarrollo, los resultados, y cierro ejecutando el sistema en vivo.`);
}

// ═══ 1 · EL PROBLEMA Y SU ORIGEN ═════════════════════════════════════════════
Sec("01", "El problema y de dónde nace", "Contexto, literatura existente y la pregunta que abre el estudio")
  .addNotes(`[01:10 – 01:15]  [PASO]  Separador — solo anunciar el bloque.`);
{
  const s = L("La basura urbana es un problema de escala mundial", "Contexto",
    "Y su monitoreo, hoy, sigue dependiendo de que alguien vaya, mire y reporte.");
  await fit(s, A("impacto.jpg"), 7.15, 1.95, 5.6, 4.4);
  const stats = [["2 010 millones t", "de residuos sólidos urbanos al año en el mundo"],
                 ["33 %", "se gestiona de forma ambientalmente insegura"],
                 ["3 400 millones t", "proyectadas para 2050 si nada cambia"]];
  stats.forEach(([n, t], i) => {
    const y = 2.0 + i * 1.45;
    s.addText(n, { x: 0.62, y, w: 6.1, h: 0.6, fontFace: F, fontSize: 27, bold: true,
      color: GRANATE, margin: 0 });
    s.addText(t, { x: 0.62, y: y + 0.58, w: 6.1, h: 0.6, fontFace: F, fontSize: 13,
      color: GRIS, margin: 0 });
  });
  s.addText("La visión computacional puede convertir ese monitoreo manual en una capa automática.",
    { x: 0.62, y: 6.28, w: 6.3, h: 0.5, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  pie(s, "Fuente: Banco Mundial — What a Waste 2.0 (Kaza et al., 2018).  Imagen: sesión de la demo del proyecto.");
  s.addNotes(`[01:15 – 02:00]  [ANCLA]

Primero, por qué importa. Según el Banco Mundial, en su informe What a Waste 2.0, el mundo genera 2 010 millones de toneladas de residuos sólidos urbanos al año. Un tercio se gestiona de forma ambientalmente insegura. Y la proyección al 2050 es de 3 400 millones de toneladas.

Detrás de esas cifras hay un problema operativo muy concreto: el monitoreo de residuos en las calles sigue siendo manual. Alguien tiene que ir, mirar y reportar. Es caro, es lento y cubre poco territorio.

La visión computacional puede convertir eso en una capa automática. Ese es el terreno donde se para este trabajo.`);
}
{
  const s = L("Qué existe hoy: cuatro datasets publicados, cuatro mundos separados", "Literatura",
    "En los últimos años la comunidad publicó datasets de basura para escenarios complementarios.");
  const refs = [
    ["TACO", "Proença & Simões, 2020", "1 500 fotos de peatón, 60 categorías, con polígonos de segmentación", AZUL],
    ["RoLID-11K", "Wu et al., WACV-W 2026", "11 564 cuadros de dashcam, una sola clase, con splits y baselines oficiales", AMBAR],
    ["UAVVaste", "Kraft et al., 2021", "772 imágenes de dron a baja altura, con split oficial propio", VERDE],
    ["StreetView-Waste", "Paulo et al., WACV 2026", "cámaras ojo de pez en camiones recolectores — enlaces no disponibles", GRIS2],
  ];
  refs.forEach(([n, cita, d, c], i) => {
    const y = 1.95 + i * 1.16;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 0.12, h: 0.85,
      fill: { color: c }, line: { color: c, width: 0 }, rectRadius: 0.03 });
    s.addText(n, { x: 0.95, y: y - 0.02, w: 2.9, h: 0.4, fontFace: F, fontSize: 15.5,
      bold: true, color: INK, margin: 0 });
    s.addText(cita, { x: 0.95, y: y + 0.38, w: 2.9, h: 0.35, fontFace: F, fontSize: 10.5,
      italic: true, color: GRIS2, margin: 0 });
    s.addText(d, { x: 4.0, y: y + 0.08, w: 8.6, h: 0.75, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
  });
  s.addText([{ text: "Y trabajos de modelado sobre ellos: ", options: { color: GRIS } },
             { text: "TrashDet ", options: { bold: true, color: INK } },
             { text: "(Tran & Hu, WACV-W 2026) busca detectores TinyML sobre TACO;  ", options: { color: GRIS } },
             { text: "detect-waste ", options: { bold: true, color: INK } },
             { text: "(Majchrowska et al., 2022) armoniza varias fuentes.", options: { color: GRIS } }],
    { x: 0.62, y: 6.7, w: 12.1, h: 0.55, fontFace: F, fontSize: 12, margin: 0 });
  s.addNotes(`[02:00 – 03:00]  [ANCLA]

Antes de contar mi propuesta, de dónde parto. En los últimos años la comunidad publicó varios datasets de basura, cada uno pensado para un escenario distinto.

TACO, de Proença y Simões, son mil quinientas fotos tomadas por un peatón, con sesenta categorías y polígonos de segmentación. RoLID-11K, publicado este año en un workshop de WACV, aporta once mil quinientos cuadros de cámara de vehículo con sus splits y baselines oficiales. UAVVaste, de Kraft y colegas, son 772 imágenes de dron. Y StreetView-Waste, también de este año, cubre cámaras ojo de pez en camiones recolectores; ese no lo pude usar porque sus enlaces de descarga no responden.

También hay trabajos de modelado: TrashDet busca detectores muy pequeños sobre TACO, y detect-waste armoniza varias de estas fuentes.

Fíjense en el patrón: cada dataset se publica, se entrena y se evalúa dentro de su propio mundo.`);
}
{
  const s = L("Los tres dominios que sí pude usar", "El problema",
    "Mismo objeto —basura en vía pública— visto desde tres alturas y tres cámaras distintas.");
  const doms = [["dominio_taco.png", "TACO · mano", "1 500 imágenes", "objeto mediano 171 px*", AZUL],
                ["dominio_rolid.png", "RoLID-11K · dashcam", "11 564 imágenes", "objeto mediano 22 px*", AMBAR],
                ["dominio_uav.png", "UAVVaste · dron", "772 imágenes", "objeto mediano 72 px*", VERDE]];
  for (let i = 0; i < 3; i++) {
    const [img, tit, n, med, c] = doms[i];
    const x = 0.62 + i * 4.18;
    await fit(s, A(img), x, 1.95, 3.9, 2.75);
    s.addText(tit, { x, y: 4.82, w: 3.9, h: 0.38, fontFace: F, fontSize: 15, bold: true,
      color: c, margin: 0 });
    s.addText(n, { x, y: 5.2, w: 3.9, h: 0.32, fontFace: F, fontSize: 11.5, color: GRIS, margin: 0 });
    s.addText(med, { x, y: 5.5, w: 3.9, h: 0.35, fontFace: F, fontSize: 12.5,
      bold: i === 1, color: i === 1 ? ROJO : GRIS, margin: 0 });
  }
  s.addText([{ text: "La diferencia clave no es el color ni el fondo: es el tamaño con que aparece el objeto. ", options: { bold: true, color: INK } },
             { text: "De 22 a 171 píxeles hay casi un orden de magnitud.", options: { color: GRIS } }],
    { x: 0.62, y: 6.2, w: 12.1, h: 0.5, fontFace: F, fontSize: 14, margin: 0 });
  pie(s, "* Medido sobre la imagen original de cada dataset. A la resolución con la que se entrena (640 px) esos tamaños se reducen a ~32, ~7 y ~12 px respectivamente — la cuenta está en la lámina de configuración experimental.");
  s.addNotes(`[03:00 – 03:45]  [ANCLA]

De esos cuatro, pude trabajar con tres. Y aquí está el dato que va a gobernar todo el trabajo.

TACO, fotos de mano: el objeto mediano mide 171 píxeles. UAVVaste, dron: 72 píxeles. RoLID, dashcam: 22 píxeles.

La diferencia entre estos dominios no es principalmente el color o el fondo, como uno pensaría. Es el tamaño con que aparece el objeto. Entre 22 y 171 píxeles hay casi un orden de magnitud. Retengan el 22: va a volver varias veces.`);
}
{
  const s = L("De ahí nace la pregunta", "El origen del estudio");
  card(s, 0.62, 1.85, 5.85, 2.0, GRIS2, "Lo que la literatura hace",
    "Cada dataset entrena y evalúa dentro de su propio dominio. Los baselines publicados son in-domain: entreno con dashcam, mido con dashcam.");
  card(s, 6.85, 1.85, 5.85, 2.0, GRANATE, "Lo que nos preguntamos",
    "¿Y si cruzamos? ¿Un detector entrenado con fotos de peatón sirve sobre imágenes de dron? ¿Cuánto se pierde, y por qué?");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 4.15, w: 12.1, h: 1.5,
    fill: { color: INK }, line: { color: INK, width: 0 }, rectRadius: 0.06 });
  s.addText("¿Cuánto se degrada un detector de residuos al cambiar de punto de vista,\ny qué pesa más para cerrar la brecha?",
    { x: 1.0, y: 4.35, w: 11.4, h: 1.1, fontFace: F, fontSize: 21, bold: true,
      color: BG, margin: 0, lineSpacing: 30 });
  s.addText("Tres sospechosos a medir:", { x: 0.62, y: 5.85, w: 3.0, h: 0.4,
    fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  ["la arquitectura del modelo", "la resolución de entrada", "la higiene de los datos"].forEach((t, i) => {
    const x = 3.55 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.78, w: 2.9, h: 0.52,
      fill: { color: BG_SUAVE }, line: { color: [AZUL, AMBAR, VERDE][i], width: 1.4 }, rectRadius: 0.05 });
    s.addText(t, { x, y: 5.88, w: 2.9, h: 0.35, fontFace: F, fontSize: 11.5,
      color: INK, align: "center", margin: 0 });
  });
  pie(s, "Alcance: este trabajo MIDE la brecha entre dominios. Entrenar un único modelo con los tres a la vez es una respuesta posible a esa brecha, y queda como trabajo futuro.");
  s.addNotes(`[03:45 – 04:40]  [ANCLA]

Entonces, de dónde nace este estudio.

La literatura hace lo natural: cada dataset entrena y evalúa dentro de su propio dominio. Los baselines publicados son in-domain — entreno con dashcam y mido con dashcam.

Y nosotros nos preguntamos: ¿y si cruzamos? ¿Un detector entrenado con fotos de peatón sirve sobre imágenes de dron? ¿Cuánto se pierde y, sobre todo, por qué se pierde?

De ahí sale la pregunta de investigación: cuánto se degrada un detector de residuos al cambiar de punto de vista, y qué pesa más para cerrar esa brecha. Hay tres sospechosos: la arquitectura, la resolución de entrada y la higiene de los datos de entrenamiento. El diseño experimental mide los tres.

Un punto de alcance importante, porque me lo pueden preguntar: este trabajo MIDE la brecha. No construye un modelo único entrenado con los tres dominios a la vez. Eso sería una respuesta posible a la brecha, y lo dejo declarado como trabajo futuro.`);
}

// ═══ 2 · VOCABULARIO ═════════════════════════════════════════════════════════
Sec("02", "Vocabulario del proyecto", "Los términos y la nomenclatura que voy a usar de aquí en adelante")
  .addNotes(`[04:40 – 04:45]  [PASO]  Separador.`);
{
  const s = L("Tres tareas distintas de visión computacional", "Vocabulario · 1 de 2");
  const tareas = [
    ["Clasificación", "¿QUÉ hay?", "Devuelve una etiqueta para toda la imagen o el recorte:\n«esto es basura» / «esto es fondo»", AZUL],
    ["Detección", "¿QUÉ hay y DÓNDE?", "Devuelve una caja por objeto, con su clase y una confianza:\n«basura, aquí, con 0.87»", AMBAR],
    ["Segmentación", "¿QUÉ píxeles lo forman?", "Etiqueta píxel por píxel: sirve para medir superficie cubierta, no solo contar objetos", VERDE],
  ];
  tareas.forEach(([t, p, d, c], i) => {
    const x = 0.62 + i * 4.18;
    card(s, x, 1.85, 3.9, 3.2, c, t, "", {});
    s.addText(p, { x: x + 0.24, y: 2.4, w: 3.4, h: 0.4, fontFace: F, fontSize: 13,
      bold: true, color: c, margin: 0 });
    s.addText(d, { x: x + 0.24, y: 2.9, w: 3.45, h: 1.9, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0, valign: "top" });
  });
  s.addText([{ text: "En este proyecto uso las tres: ", options: { color: GRIS } },
             { text: "la detección es la tarea principal", options: { bold: true, color: INK } },
             { text: "; la clasificación y la segmentación aportan evidencia complementaria.", options: { color: GRIS } }],
    { x: 0.62, y: 5.3, w: 12.1, h: 0.5, fontFace: F, fontSize: 13.5, margin: 0 });
  card(s, 0.62, 5.9, 12.1, 0.95, GRIS2, "",
    "COCO (Common Objects in Context) es el estándar de facto del área: define el formato de anotación, las reglas de evaluación y las métricas que usa toda la literatura de detección. Cuando diga «formato COCO» o «métricas COCO» me refiero a esa convención compartida.", { bf: 11.5 });
  s.addNotes(`[04:45 – 05:35]  [ANCLA]

Voy a fijar vocabulario, porque después uso estos términos sin parar.

Hay tres tareas distintas. Clasificación responde qué hay: le doy una imagen o un recorte y devuelve una etiqueta, basura o fondo. Detección responde qué hay y dónde: devuelve una caja por objeto, con su clase y una confianza. Y segmentación responde qué píxeles lo forman: etiqueta píxel por píxel, lo que sirve para medir superficie cubierta y no solo contar objetos.

En este proyecto uso las tres, pero la tarea principal es la detección; las otras dos aportan evidencia complementaria.

Y un término que voy a repetir: COCO. Es el estándar de facto del área —Common Objects in Context—: define el formato de anotación, las reglas de evaluación y las métricas que usa toda la literatura de detección.`);
}
{
  const s = L("Cómo leer los códigos de este proyecto", "Vocabulario · 2 de 2",
    "Dos espacios de nombres distintos que voy a usar en las siguientes láminas.");
  card(s, 0.62, 2.0, 5.95, 2.15, ROJO, "H1 … H7  ·  Hallazgos de la auditoría",
    "Defectos que encontré en los datasets ya publicados, antes de entrenar.\n\nEjemplo: H4 = fuga de video en los splits oficiales de RoLID-11K.", { bf: 12 });
  card(s, 6.78, 2.0, 5.95, 2.15, AZUL, "Letra + número  ·  Experimentos",
    "Cada corrida de entrenamiento tiene un código, agrupado por familia de modelo.\n\nEjemplo: E4 = cuarto experimento de la familia VGG.", { bf: 12 });
  const fams = [["E", "VGG-16", "clasificación", VERDE], ["D", "FCN", "segmentación", ROJO],
                ["A / B / C", "Faster R-CNN", "detección", AZUL], ["F / G / H", "YOLOv11n", "detección", AMBAR]];
  s.addText("Las cuatro familias de experimentos:", { x: 0.62, y: 4.5, w: 5, h: 0.4,
    fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  fams.forEach(([cod, mod, tar, c], i) => {
    const x = 0.62 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.0, w: 2.85, h: 1.15,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.5 }, rectRadius: 0.05 });
    s.addText(cod, { x: x + 0.2, y: 5.12, w: 2.5, h: 0.4, fontFace: F, fontSize: 17,
      bold: true, color: c, margin: 0 });
    s.addText(mod, { x: x + 0.2, y: 5.52, w: 2.5, h: 0.3, fontFace: F, fontSize: 12,
      bold: true, color: INK, margin: 0 });
    s.addText(tar, { x: x + 0.2, y: 5.8, w: 2.5, h: 0.3, fontFace: F, fontSize: 11,
      color: GRIS, margin: 0 });
  });
  pie(s, "Aviso: la letra H aparece en los dos espacios (H4 es un hallazgo; H1 y H2 son experimentos YOLO a 1024 px). Siempre diré «hallazgo H4» o «experimento H1».");
  s.addNotes(`[05:35 – 06:20]  [ANCLA]   ←  VERSIÓN A (mantiene H1–H7 como en el paper)

Segunda cosa de vocabulario, y es puramente práctica: cómo leer los códigos que voy a usar.

Hay dos espacios de nombres. Los que empiezan con H, del H1 al H7, son hallazgos de la auditoría: defectos que encontré en los datasets ya publicados, antes de entrenar nada. Por ejemplo, H4 es la fuga de video en los splits oficiales de RoLID.

Y los que combinan letra y número son experimentos, uno por corrida de entrenamiento, agrupados por familia: la E es VGG para clasificación, la D es FCN para segmentación, las letras A, B y C son Faster R-CNN, y F, G y H son YOLO.

Un aviso honesto: la letra H aparece en los dos espacios. H4 es un hallazgo, pero H1 y H2 son experimentos YOLO. Para evitar confusión, siempre voy a decir "hallazgo H4" o "experimento H1".

[Esta es una de dos versiones alternativas — la siguiente lámina usa el prefijo AUD-. Elegir una y ocultar la otra.]`);
}
{
  const s = L("Cómo leer los códigos de este proyecto", "Vocabulario · 2 de 2  ·  versión alternativa",
    "Misma idea, renombrando los hallazgos para eliminar del todo la ambigüedad.");
  card(s, 0.62, 2.0, 5.95, 2.15, ROJO, "AUD-1 … AUD-7  ·  Hallazgos de la auditoría",
    "Defectos que encontré en los datasets ya publicados, antes de entrenar.\n\nEjemplo: AUD-4 = fuga de video en los splits oficiales de RoLID-11K.", { bf: 12 });
  card(s, 6.78, 2.0, 5.95, 2.15, AZUL, "Letra + número  ·  Experimentos",
    "Cada corrida de entrenamiento tiene un código, agrupado por familia de modelo.\n\nEjemplo: E4 = cuarto experimento de la familia VGG.", { bf: 12 });
  const fams = [["E", "VGG-16", "clasificación", VERDE], ["D", "FCN", "segmentación", ROJO],
                ["A / B / C", "Faster R-CNN", "detección", AZUL], ["F / G / H", "YOLOv11n", "detección", AMBAR]];
  s.addText("Las cuatro familias de experimentos:", { x: 0.62, y: 4.5, w: 5, h: 0.4,
    fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  fams.forEach(([cod, mod, tar, c], i) => {
    const x = 0.62 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.0, w: 2.85, h: 1.15,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.5 }, rectRadius: 0.05 });
    s.addText(cod, { x: x + 0.2, y: 5.12, w: 2.5, h: 0.4, fontFace: F, fontSize: 17,
      bold: true, color: c, margin: 0 });
    s.addText(mod, { x: x + 0.2, y: 5.52, w: 2.5, h: 0.3, fontFace: F, fontSize: 12,
      bold: true, color: INK, margin: 0 });
    s.addText(tar, { x: x + 0.2, y: 5.8, w: 2.5, h: 0.3, fontFace: F, fontSize: 11,
      color: GRIS, margin: 0 });
  });
  pie(s, "Con este esquema no hay colisión posible: los hallazgos llevan prefijo AUD- y los experimentos solo letra + número.");
  s.addNotes(`[LÁMINA ALTERNATIVA — VERSIÓN B]  Elegir una de las dos y ocultar la otra.

Esta versión renombra los hallazgos como AUD-1 a AUD-7 (de "auditoría") y elimina por completo la colisión con los experimentos H1 y H2.

Ventaja: cero ambigüedad al hablar.
Desventaja: el paper y la bitácora del repositorio usan H1–H7, así que habría una diferencia de nomenclatura entre la presentación y los documentos escritos.

Si eliges esta versión, recuerda decir AUD-4 en lugar de H4 en las láminas de auditoría.`);
}

// ═══ 3 · HERRAMIENTAS Y JUSTIFICACIÓN ════════════════════════════════════════
Sec("03", "Las herramientas y su justificación", "Primero qué hace cada modelo; después, por qué elegí esos")
  .addNotes(`[06:20 – 06:30]  [PASO]

Ahora las herramientas. El orden que voy a seguir es: primero explico qué hace cada una, brevemente, y al final dedico una lámina completa a justificar por qué elegí esas y no otras.`);
{
  const s = L("Transferencia de aprendizaje", "Herramientas · 1 de 4",
    "Reutilizar una red ya entrenada en lugar de aprender todo desde cero.");
  const pasos = [
    ["Red preentrenada", "VGG-16, entrenada con 1.2 millones de imágenes de ImageNet (1 000 categorías generales)", AZUL],
    ["Se conserva el cuerpo", "las capas convolucionales ya aprendieron bordes, texturas y formas: eso es genérico y sirve igual", GRIS2],
    ["Se reemplaza la cabeza", "un clasificador nuevo, entrenado con MI pregunta: ¿este recorte tiene basura?", GRANATE],
  ];
  pasos.forEach(([t, d, c], i) => {
    const x = 0.62 + i * 4.18;
    card(s, x, 1.95, 3.75, 1.95, c, t, d, { bf: 11.5 });
    if (i < 2) flecha(s, x + 3.78, 2.65, 0.38);
  });
  await fit(s, A("gradcam_crop.jpg"), 1.4, 4.3, 2.3, 2.15);
  s.addText("Entrada: un recorte de 224×224 px", { x: 3.95, y: 4.65, w: 4.2, h: 0.4,
    fontFace: F, fontSize: 12.5, bold: true, color: INK, margin: 0 });
  s.addText("Salida: probabilidad de que contenga basura", { x: 3.95, y: 5.05, w: 4.3, h: 0.4,
    fontFace: F, fontSize: 12.5, color: GRIS, margin: 0 });
  card(s, 8.4, 4.35, 4.3, 2.05, VERDE, "¿Por qué es indispensable aquí?",
    "TACO tiene 1 500 imágenes. VGG-16 tiene 138 millones de parámetros. Entrenarlo desde cero exigiría del orden de un millón de imágenes: sin transferencia, este proyecto no existe.", { bf: 11.5 });
  s.addNotes(`[06:30 – 07:20]  [ANCLA]

Primera herramienta: transferencia de aprendizaje.

VGG-16 es una red entrenada con 1.2 millones de imágenes de ImageNet, en mil categorías generales. Sus capas convolucionales ya aprendieron a detectar bordes, texturas y formas. Ese conocimiento es genérico: sirve igual para reconocer un perro que para reconocer una botella.

Entonces conservo ese cuerpo y reemplazo solo la cabeza: un clasificador nuevo que entreno con mi pregunta, que es "¿este recorte de 224 por 224 tiene basura?".

¿Por qué es indispensable aquí? TACO tiene mil quinientas imágenes; VGG tiene 138 millones de parámetros. Entrenar desde cero exigiría del orden de un millón de imágenes. Sin transferencia, este proyecto simplemente no existiría.`);
}
{
  const s = L("Detección: el mecanismo de las anclas", "Herramientas · 2 de 4",
    "Cómo un detector propone «puede haber algo aquí» antes de decidir qué es.");
  s.addText("El modelo no busca objetos libremente: recorre la imagen con cajas de referencia de tamaños y proporciones fijas —las anclas— y evalúa cada una.",
    { x: 0.62, y: 1.85, w: 12.1, h: 0.5, fontFace: F, fontSize: 13, color: GRIS, margin: 0 });
  const escalas = [["32²", 0.5], ["64²", 0.85], ["128²", 1.25], ["256²", 1.65], ["512²", 2.05]];
  s.addText("Escalas de ancla en la pirámide FPN (5 niveles)", { x: 0.62, y: 2.45, w: 6, h: 0.35,
    fontFace: F, fontSize: 12, bold: true, color: INK, margin: 0 });
  escalas.forEach(([t, size], i) => {
    const cx = 1.5 + i * 2.05;
    s.addShape(pres.shapes.RECTANGLE, { x: cx - size / 2, y: 4.9 - size, w: size, h: size,
      fill: { color: BG_SUAVE }, line: { color: i === 0 ? ROJO : AZUL, width: i === 0 ? 2.2 : 1.5 } });
    s.addText(t + " px", { x: cx - 0.6, y: 4.97, w: 1.2, h: 0.3, fontFace: F, fontSize: 11,
      bold: i === 0, color: i === 0 ? ROJO : GRIS, align: "center", margin: 0 });
  });
  s.addText("× 3 proporciones\n{1:2, 1:1, 2:1}", { x: 11.3, y: 3.9, w: 1.5, h: 0.7,
    fontFace: F, fontSize: 11, italic: true, color: GRIS2, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 5.42, w: 12.1, h: 0.95,
    fill: { color: "FDECEA" }, line: { color: ROJO, width: 1.6 }, rectRadius: 0.05 });
  s.addText([{ text: "El objeto mediano de dashcam queda en ~7 px a la resolución de entrada: ", options: { bold: true, color: ROJO } },
             { text: "casi 5× por debajo de la ancla más pequeña. El detector, literalmente, no tiene una caja de referencia de ese tamaño. Este mecanismo explica el resultado principal del trabajo.", options: { color: INK } }],
    { x: 0.95, y: 5.6, w: 11.5, h: 0.65, fontFace: F, fontSize: 13, margin: 0 });
  s.addText([{ text: "Y la red aprende dos cosas a la vez  →   ", options: { bold: true, color: INK } },
             { text: "L = L", options: { color: GRIS } }, { text: "clasificación", options: { color: GRIS, fontSize: 9 } },
             { text: "  +  λ · L", options: { color: GRIS } }, { text: "caja", options: { color: GRIS, fontSize: 9 } },
             { text: "        qué es  +  dónde está exactamente", options: { color: GRIS2, italic: true } }],
    { x: 0.62, y: 6.5, w: 12.1, h: 0.45, fontFace: F, fontSize: 13, margin: 0 });
  s.addNotes(`[07:20 – 08:15]  [ANCLA]

Segunda herramienta: la detección. Y quiero detenerme en un mecanismo concreto, porque explica el resultado principal.

Un detector no busca objetos libremente por la imagen. Recorre la imagen con cajas de referencia de tamaños y proporciones fijas —se llaman anclas— y evalúa cada una: ¿aquí hay algo o no?

En la arquitectura que uso, esas anclas tienen cinco escalas: 32, 64, 128, 256 y 512 píxeles al cuadrado, cada una con tres proporciones de aspecto. La más pequeña es la de 32 píxeles.

Y aquí está el punto. El objeto mediano de dashcam mide 22 píxeles en la imagen original, pero el modelo no ve esa imagen: ve la versión reescalada a la resolución de entrada. A 640 píxeles, ese objeto queda en unos siete. Casi cinco veces por debajo de la ancla más pequeña. El detector, literalmente, no tiene una caja de referencia de ese tamaño. Esto va a explicar por qué el dominio dashcam se comporta como una isla. En la lámina de configuración experimental hago la cuenta para los tres dominios.

Una nota adicional: la red aprende dos cosas a la vez, y eso se ve en la función de pérdida — un término de clasificación, qué es, más un término de caja, dónde está exactamente, ponderados por lambda.`);
}
{
  const s = L("Dos filosofías de detección", "Herramientas · 3 de 4",
    "La misma foto de mi demo, procesada por los dos enfoques que comparo en el trabajo.");
  card(s, 0.62, 1.9, 5.95, 0.95, AZUL, "Dos etapas  ·  Faster R-CNN  ·  41.3 M parámetros",
    "1. Una red de propuestas (RPN) sugiere regiones usando las anclas.   2. Cada región se clasifica y se ajusta.", { bf: 11, tf: 13.5 });
  await fit(s, A("frcnn_ej.jpg"), 0.62, 3.0, 5.95, 2.6);
  s.addText("Más preciso, más lento, y su red de propuestas es inspeccionable", { x: 0.62, y: 5.7, w: 5.95, h: 0.35,
    fontFace: F, fontSize: 11.5, italic: true, color: GRIS2, margin: 0 });
  card(s, 6.78, 1.9, 5.95, 0.95, AMBAR, "Una etapa  ·  YOLOv11n  ·  2.6 M parámetros",
    "Divide la imagen en una grilla; cada celda predice cajas y clases en una sola pasada.", { bf: 11, tf: 13.5 });
  await fit(s, A("yolo_ej.jpg"), 6.78, 3.0, 5.95, 2.6);
  s.addText("16× más pequeño, apto para tiempo real y dispositivos de borde", { x: 6.78, y: 5.7, w: 5.95, h: 0.35,
    fontFace: F, fontSize: 11.5, italic: true, color: GRIS2, margin: 0 });
  pie(s, "Ambas imágenes son la misma escena de la sesión de demostración, procesada por cada modelo con su propio umbral de confianza.");
  s.addNotes(`[08:15 – 09:00]  [ANCLA]

Con las anclas ya explicadas, las dos filosofías de detección que comparo.

Faster R-CNN trabaja en dos etapas. Primero, una red de propuestas usa las anclas para sugerir regiones candidatas. Después, cada región se clasifica y se ajusta. Son 41.3 millones de parámetros: más preciso, más lento, y con la ventaja de que su red de propuestas se puede inspeccionar.

YOLO lo hace en una sola pasada: divide la imagen en una grilla y cada celda predice cajas y clases directamente. Son 2.6 millones de parámetros, dieciséis veces menos, y corre en tiempo real.

Las dos imágenes que ven son la misma escena de mi demo, procesada por cada modelo. Fíjense que Faster R-CNN, a la izquierda, propone bastantes más cajas.`);
}
{
  const s = L("Segmentación e interpretabilidad", "Herramientas · 4 de 4",
    "Las dos herramientas complementarias: medir superficie y auditar en qué se fija la red.");
  card(s, 0.62, 1.9, 5.95, 1.15, VERDE, "Segmentación  ·  FCN-ResNet18",
    "Clasifica cada píxel: ¿basura o fondo? Usa entropía cruzada ponderada, porque el fondo domina la imagen y sin ponderar la red aprendería a decir «todo es fondo».", { bf: 11.5, tf: 13.5 });
  await fit(s, A("fcn_overlay.jpg"), 0.62, 3.2, 5.95, 2.7);
  s.addText("Responde: ¿qué proporción de la escena está cubierta?", { x: 0.62, y: 6.0, w: 5.95, h: 0.35,
    fontFace: F, fontSize: 11.5, italic: true, color: GRIS2, margin: 0 });
  card(s, 6.78, 1.9, 5.95, 1.15, MORADO, "Interpretabilidad  ·  CAM y Grad-CAM",
    "El gradiente de la clase pondera los mapas de activación y produce un mapa de calor: dónde miró la red para decidir.", { bf: 11.5, tf: 13.5 });
  await fit(s, A("gradcam_crop.jpg"), 6.78, 3.2, 2.85, 2.7);
  await fit(s, A("gradcam_mapa.jpg"), 9.85, 3.2, 2.85, 2.7);
  s.addText("Responde: ¿miró el objeto, o aprendió el fondo?", { x: 6.78, y: 6.0, w: 5.95, h: 0.35,
    fontFace: F, fontSize: 11.5, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[09:00 – 09:40]  [ANCLA]

Las dos herramientas complementarias.

La segmentación con una red totalmente convolucional clasifica cada píxel: basura o fondo. Un detalle técnico: uso entropía cruzada ponderada por clase, porque el fondo domina ampliamente la imagen; sin ponderar, la red aprendería que lo más rentable es decir que todo es fondo. Esto responde una pregunta distinta a la detección: qué proporción de la escena está cubierta.

Y Grad-CAM responde una pregunta de auditoría. Toma el gradiente de la clase, lo usa para ponderar los mapas de activación, y produce un mapa de calor que muestra dónde miró la red para decidir. A la derecha ven un recorte y su mapa: la activación está sobre el objeto, no sobre el pasto. Eso es exactamente lo que quería verificar.`);
}
{
  const s = L("Por qué elegí estas técnicas", "Justificación",
    "Cada elección responde a una restricción concreta del problema, no a una preferencia.");
  const filas = [
    ["Transferencia\nde aprendizaje", "entrenar VGG desde cero", "1 500 imágenes contra 138 M de parámetros: sin red preentrenada no hay proyecto"],
    ["Cuerpo ResNet-50\ncon pirámide FPN", "un cuerpo de una sola escala", "el «cuerpo» extrae características; la «pirámide» las produce en 5 tamaños a la vez, y mis objetos van de 22 a 171 px"],
    ["Faster R-CNN\n(dos etapas)", "usar solo un detector moderno", "su red de propuestas expone las anclas: convierte mi hipótesis de escala en algo medible, no solo observable"],
    ["YOLOv11n\n(una etapa)", "una versión grande de YOLO", "2.6 M de parámetros es el tamaño que cabría en un dispositivo dentro de un camión municipal: pone a prueba el despliegue real"],
    ["FCN con\nResNet-18", "un cuerpo pesado también aquí", "la tarea es binaria y densa; con un cuerpo ligero alcanza, y el presupuesto de cómputo se va a los detectores"],
    ["CAM y\nGrad-CAM", "confiar solo en la exactitud", "97.8 % de exactitud podría lograrse aprendiendo el fondo; la interpretabilidad es la que descarta ese riesgo"],
  ];
  s.addText("ELEGIDO", { x: 0.62, y: 1.82, w: 2.4, h: 0.3, fontFace: F, fontSize: 10,
    bold: true, color: VERDE, charSpacing: 1.5, margin: 0 });
  s.addText("DESCARTADO", { x: 3.35, y: 1.82, w: 2.4, h: 0.3, fontFace: F, fontSize: 10,
    bold: true, color: GRIS2, charSpacing: 1.5, margin: 0 });
  s.addText("POR QUÉ", { x: 6.35, y: 1.82, w: 2.4, h: 0.3, fontFace: F, fontSize: 10,
    bold: true, color: GRANATE, charSpacing: 1.5, margin: 0 });
  filas.forEach(([el, de, pq], i) => {
    const y = 2.12 + i * 0.77;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 2.55, h: 0.68,
      fill: { color: "E9F5EE" }, line: { color: VERDE, width: 1.3 }, rectRadius: 0.04 });
    s.addText(el, { x: 0.72, y: y + 0.03, w: 2.35, h: 0.62, fontFace: F, fontSize: 10.5,
      bold: true, color: INK, margin: 0 });
    s.addText(de, { x: 3.35, y: y + 0.13, w: 2.85, h: 0.48, fontFace: F, fontSize: 10.5,
      color: GRIS2, italic: true, margin: 0 });
    s.addText(pq, { x: 6.35, y: y + 0.0, w: 6.35, h: 0.68, fontFace: F, fontSize: 10.5,
      color: GRIS, margin: 0 });
  });
  pie(s, "Los detectores transformer (CO-DETR) lideran el benchmark in-domain de RoLID, pero quedaron fuera por la regla de presupuesto de 20 h por experimento. Declarados en trabajo futuro.");
  s.addNotes(`[09:40 – 10:50]  [ANCLA]

Ahora la pregunta que de verdad importa: por qué estas técnicas y no otras. En verde lo elegido, al centro la alternativa que descarté, y a la derecha la razón.

Transferencia de aprendizaje en vez de entrenar VGG desde cero: mil quinientas imágenes contra 138 millones de parámetros. Sin red preentrenada no hay proyecto.

El cuerpo ResNet-50 con pirámide FPN, en vez de un cuerpo de una sola escala. Déjenme aclarar los términos: el "cuerpo" es la parte de la red que extrae características de la imagen; la "pirámide" hace que esas características se produzcan en cinco tamaños distintos a la vez. Como mis objetos van de 22 a 171 píxeles, necesito exactamente eso.

Faster R-CNN de dos etapas, en vez de usar solo un detector moderno: porque su red de propuestas expone las anclas de forma explícita, y eso convierte mi hipótesis sobre la escala en algo medible, no solo observable.

YOLOv11n, la versión más pequeña, en vez de una grande: 2.6 millones de parámetros es el tamaño que cabría en un dispositivo montado en un camión municipal. Pone a prueba la hipótesis de despliegue real.

FCN con ResNet-18 y no un cuerpo pesado: la tarea es binaria y densa, con un cuerpo ligero alcanza, y así el presupuesto de cómputo se va donde hace falta, que son los detectores.

Y CAM en vez de confiar solo en la exactitud: un 97.8 % podría lograrse aprendiendo el fondo en lugar del objeto. La interpretabilidad es la que descarta ese riesgo.`);
}

// ═══ 4 · MÉTRICAS ════════════════════════════════════════════════════════════
Sec("04", "Cómo se mide", "De IoU al mAP: la cadena completa, un concepto por lámina")
  .addNotes(`[10:50 – 11:00]  [PASO]

Ahora cómo se mide. En detección no basta con decir "acertó" o "falló", porque una caja puede estar casi bien. Voy a construir la métrica desde el principio, un concepto por lámina.`);
{
  const s = L("IoU: cuánto se parecen dos cajas", "Métricas · 1 de 7",
    "El problema de fondo: una caja predicha casi nunca coincide exactamente con la real.");
  s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 2.35, w: 3.0, h: 2.2,
    fill: { color: AZUL, transparency: 82 }, line: { color: AZUL, width: 2.2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.85, y: 3.1, w: 3.0, h: 2.2,
    fill: { color: AMBAR, transparency: 82 }, line: { color: AMBAR, width: 2.2 } });
  s.addText("caja real (anotada)", { x: 1.5, y: 2.0, w: 2.6, h: 0.3, fontFace: F,
    fontSize: 11, bold: true, color: AZUL, margin: 0 });
  s.addText("caja predicha", { x: 4.05, y: 5.35, w: 1.9, h: 0.3, fontFace: F,
    fontSize: 11, bold: true, color: AMBAR, margin: 0 });
  s.addText("intersección", { x: 2.93, y: 3.6, w: 1.5, h: 0.3, fontFace: F, fontSize: 10,
    bold: true, color: INK, margin: 0 });
  s.addText("IoU  =", { x: 6.9, y: 2.65, w: 1.3, h: 0.55, fontFace: F, fontSize: 22,
    bold: true, color: INK, margin: 0 });
  s.addText("área de intersección", { x: 8.25, y: 2.45, w: 3.5, h: 0.45, fontFace: F,
    fontSize: 16, color: INK, align: "center", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 8.25, y: 2.95, w: 3.5, h: 0, line: { color: INK, width: 1.5 } });
  s.addText("área de unión", { x: 8.25, y: 3.02, w: 3.5, h: 0.45, fontFace: F,
    fontSize: 16, color: INK, align: "center", margin: 0 });
  s.addText("0 = no se tocan          1 = coinciden exactamente", { x: 6.9, y: 3.7, w: 5.8, h: 0.35,
    fontFace: F, fontSize: 12, italic: true, color: GRIS2, margin: 0 });
  card(s, 6.9, 4.25, 5.8, 2.05, GRANATE, "¿Y por qué el umbral en 0.5?",
    "Es la convención del estándar COCO, adoptada por toda la literatura: con IoU ≥ 0.5 la detección se cuenta como correcta.\n\nNo es un número mágico: es un acuerdo que permite comparar trabajos entre sí. COCO además reporta umbrales más exigentes, de 0.5 a 0.95, para medir localización fina.", { bf: 11.5 });
  s.addNotes(`[11:00 – 11:50]  [ANCLA]

Empecemos por el problema de fondo: una caja predicha casi nunca coincide exactamente con la real. Entonces, ¿cuándo digo que acertó?

La respuesta es IoU: intersección sobre unión. Tomo el área donde las dos cajas se solapan y la divido entre el área total que ocupan juntas. Si no se tocan da cero; si coinciden exactamente da uno.

Y aquí viene la pregunta que siempre surge: ¿por qué el umbral en 0.5? No es un número mágico. Es la convención del estándar COCO, adoptada por toda la literatura: con un solapamiento de la mitad o más, la detección se cuenta como correcta. Su valor está en que permite comparar trabajos entre sí. COCO además reporta umbrales más exigentes, del 0.5 al 0.95, cuando interesa medir qué tan fina es la localización.`);
}
{
  const s = L("Con el umbral, cada predicción cae en una categoría", "Métricas · 2 de 7",
    "Imagen real del conjunto de test de TACO, evaluada con mi modelo YOLOv11n.");
  await fit(s, A("p_tpfpfn.png"), 0.62, 1.9, 4.5, 4.9);
  const leg = [["Verdadero positivo  (TP)", "detectó basura que sí estaba", VERDE],
               ["Falso positivo  (FP)", "detectó basura donde no había", AMBAR],
               ["Falso negativo  (FN)", "basura real que no encontró", ROJO]];
  leg.forEach(([t, d, c], i) => {
    const y = 2.0 + i * 0.9;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: y + 0.04, w: 0.34, h: 0.34,
      fill: { color: BG }, line: { color: c, width: 3 } });
    s.addText(t, { x: 6.05, y, w: 4.6, h: 0.38, fontFace: F, fontSize: 13.5, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 6.05, y: y + 0.35, w: 5.0, h: 0.35, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
  });
  card(s, 5.5, 4.85, 7.2, 1.75, GRIS2, "¿Y el verdadero negativo (TN)?",
    "En detección no existe: sería «el modelo acertó al no poner una caja aquí», y ese «aquí» son millones de posiciones y tamaños posibles en cada imagen. Por eso las métricas de detección se construyen solo con TP, FP y FN — y por eso no se usa exactitud, que sí necesita los TN.", { bf: 11.5 });
  s.addNotes(`[11:50 – 12:45]  [ANCLA]

Con el umbral ya definido, cada predicción cae en una de tres categorías. Esto no es un diagrama: es una imagen del conjunto de test de TACO evaluada con mi modelo.

En verde, verdadero positivo: detectó basura que sí estaba. En ámbar, falso positivo: puso una caja donde no había nada. En rojo, falso negativo: basura real que no encontró.

Y aquí una pregunta que suele hacerse: ¿dónde está el verdadero negativo, el TN? En detección, sencillamente no existe. Sería "el modelo acertó al no poner una caja aquí", y ese "aquí" son millones de posiciones y tamaños posibles en cada imagen: el número no significaría nada.

Por eso las métricas de detección se construyen solo con TP, FP y FN. Y por eso —esto es importante— no se usa exactitud, que sí necesita los verdaderos negativos.`);
}
{
  const s = L("Precisión y recall: dos preguntas distintas", "Métricas · 3 de 7",
    "Las dos únicas métricas que se pueden construir sin verdaderos negativos.");
  card(s, 0.62, 1.95, 5.95, 2.3, AZUL, "Precisión", "", {});
  s.addText("TP / (TP + FP)", { x: 0.9, y: 2.55, w: 5.4, h: 0.5, fontFace: F, fontSize: 21,
    bold: true, color: AZUL, margin: 0 });
  s.addText("De todo lo que el modelo dijo, ¿cuánto era cierto?", { x: 0.9, y: 3.1, w: 5.4, h: 0.4,
    fontFace: F, fontSize: 13, color: INK, margin: 0 });
  s.addText("Un modelo con precisión baja «inventa»: llena la imagen de cajas falsas.",
    { x: 0.9, y: 3.5, w: 5.4, h: 0.5, fontFace: F, fontSize: 11.5, color: GRIS, margin: 0 });
  card(s, 6.78, 1.95, 5.95, 2.3, AMBAR, "Recall", "", {});
  s.addText("TP / (TP + FN)", { x: 7.06, y: 2.55, w: 5.4, h: 0.5, fontFace: F, fontSize: 21,
    bold: true, color: AMBAR, margin: 0 });
  s.addText("De todo lo que había, ¿cuánto encontró?", { x: 7.06, y: 3.1, w: 5.4, h: 0.4,
    fontFace: F, fontSize: 13, color: INK, margin: 0 });
  s.addText("Un modelo con recall bajo «se pierde cosas»: deja basura sin detectar.",
    { x: 7.06, y: 3.5, w: 5.4, h: 0.5, fontFace: F, fontSize: 11.5, color: GRIS, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 4.55, w: 12.1, h: 2.05,
    fill: { color: BG_SUAVE }, line: { color: GRANATE, width: 1.6 }, rectRadius: 0.05 });
  s.addText("Por qué hacen falta las dos, y por qué ninguna basta sola", { x: 0.95, y: 4.72, w: 11.5, h: 0.4,
    fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
  s.addText("Están en tensión, y quien las gobierna es el umbral de confianza: si lo bajo, el modelo reporta más cajas — sube el recall pero baja la precisión — y si lo subo pasa lo contrario. Optimizar una sola es trivial y engañoso: un modelo que solo reportara su detección más segura tendría precisión perfecta y recall pésimo. Por eso la métrica final tiene que considerar las dos a la vez.",
    { x: 0.95, y: 5.15, w: 11.5, h: 1.3, fontFace: F, fontSize: 12.5, color: GRIS, margin: 0, valign: "top" });
  s.addNotes(`[12:45 – 13:35]  [ANCLA]

Con TP, FP y FN se construyen dos métricas, y son las dos que importan.

Precisión: TP sobre TP más FP. De todo lo que el modelo dijo, cuánto era cierto. Un modelo con precisión baja inventa: llena la imagen de cajas falsas.

Recall: TP sobre TP más FN. De todo lo que había, cuánto encontró. Un modelo con recall bajo se pierde cosas: deja basura sin detectar.

¿Por qué hacen falta las dos? Porque están en tensión, y quien las gobierna es el umbral de confianza. Si bajo el umbral, el modelo reporta más cajas: sube el recall pero baja la precisión. Si lo subo, pasa lo contrario.

Y optimizar una sola es trivial y engañoso: un modelo que solo reportara su detección más segura tendría precisión perfecta y recall pésimo. Por eso la métrica final tiene que considerar las dos al mismo tiempo. Eso es lo que hace la siguiente lámina.`);
}
{
  const s = L("La curva precisión-recall", "Métricas · 4 de 7",
    "Qué pasa si recorro todos los umbrales de confianza posibles, en vez de fijar uno.");
  await fit(s, A("p_pr.png"), 0.62, 1.85, 7.2, 4.9);
  const pasos = [["1", "Fijo un umbral y calculo precisión y recall: obtengo un punto."],
                 ["2", "Repito para todos los umbrales, de 1.0 a 0.0: obtengo la curva."],
                 ["3", "Cada punto es un compromiso posible del mismo modelo."]];
  pasos.forEach(([n, t], i) => {
    const y = 2.1 + i * 1.15;
    s.addText(n, { x: 8.2, y, w: 0.5, h: 0.45, fontFace: F, fontSize: 19, bold: true,
      color: GRANATE, margin: 0 });
    s.addText(t, { x: 8.75, y: y + 0.02, w: 3.95, h: 1.0, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
  });
  card(s, 8.2, 5.6, 4.5, 1.15, AZUL, "",
    "La curva describe al modelo completo, sin depender de qué umbral elija después el usuario.", { bf: 12 });
  pie(s, "Curva real del proyecto: modelo YOLOv11n entrenado con RoLID, evaluado en su conjunto de test con IoU 0.5.");
  s.addNotes(`[13:35 – 14:15]  [ANCLA]

Entonces, en vez de fijar un umbral arbitrario, los recorro todos.

Fijo un umbral, calculo precisión y recall, y obtengo un punto. Repito para todos los umbrales, del más alto al más bajo, y obtengo esta curva. Cada punto de la curva es un compromiso posible del mismo modelo.

Arriba a la izquierda: umbral alto, pocas detecciones pero casi todas ciertas. Abajo a la derecha: umbral bajo, encuentra más pero inventa más.

Lo valioso es que la curva describe al modelo completo, sin depender de qué umbral elija después el usuario. Y esta curva no es ilustrativa: la calculé con las predicciones guardadas de uno de mis modelos.`);
}
{
  const s = L("AP: la curva resumida en un número", "Métricas · 5 de 7",
    "Average Precision, el área bajo la curva precisión-recall.");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 1.95, w: 12.1, h: 1.35,
    fill: { color: BG_SUAVE }, line: { color: AZUL, width: 1.6 }, rectRadius: 0.05 });
  s.addText("AP  =  área bajo la curva precisión-recall", { x: 0.95, y: 2.12, w: 6.6, h: 0.5,
    fontFace: F, fontSize: 19, bold: true, color: INK, margin: 0 });
  s.addText([{ text: "en la práctica se calcula como  ", options: { color: GRIS } },
             { text: "AP = Σ (r", options: { color: INK, bold: true } },
             { text: "n+1", options: { color: INK, bold: true, fontSize: 9 } },
             { text: " − r", options: { color: INK, bold: true } },
             { text: "n", options: { color: INK, bold: true, fontSize: 9 } },
             { text: ") · p", options: { color: INK, bold: true } },
             { text: "interp", options: { color: INK, bold: true, fontSize: 9 } },
             { text: "(r", options: { color: INK, bold: true } },
             { text: "n+1", options: { color: INK, bold: true, fontSize: 9 } },
             { text: ")", options: { color: INK, bold: true } },
             { text: "   — la suma de los rectángulos bajo la curva", options: { color: GRIS } }],
    { x: 0.95, y: 2.68, w: 11.4, h: 0.45, fontFace: F, fontSize: 13, margin: 0 });
  card(s, 0.62, 3.55, 3.85, 1.5, VERDE, "AP alto",
    "mantiene buena precisión aunque suba el recall: encuentra mucho sin inventar.", { bf: 11.5 });
  card(s, 4.75, 3.55, 3.85, 1.5, AMBAR, "AP medio",
    "para encontrar más empieza a equivocarse: la curva cae pronto.", { bf: 11.5 });
  card(s, 8.88, 3.55, 3.85, 1.5, ROJO, "AP bajo",
    "o inventa mucho, o encuentra poco, o ambas cosas.", { bf: 11.5 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 5.3, w: 12.1, h: 1.35,
    fill: { color: "FDF3E3" }, line: { color: AMBAR, width: 1.5 }, rectRadius: 0.05 });
  s.addText([{ text: "Ojo con el detalle que sigue:  ", options: { bold: true, color: INK } },
             { text: "el AP depende del umbral de IoU que use para decidir qué cuenta como acierto. Con IoU 0.5 se llama ", options: { color: GRIS } },
             { text: "AP50", options: { bold: true, color: INK } },
             { text: " — de ahí viene el «50». Cambiando ese umbral, o promediando varios, aparecen las demás variantes de la familia.", options: { color: GRIS } }],
    { x: 0.95, y: 5.5, w: 11.5, h: 0.95, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[14:15 – 15:00]  [ANCLA]

Ahora sí: el AP, average precision, es el área bajo esa curva. Un solo número que resume todo el compromiso entre precisión y recall.

En la práctica se calcula como una suma de rectángulos bajo la curva: la fórmula que ven es exactamente eso, sumar el ancho entre dos niveles de recall por la precisión interpolada en ese tramo.

La lectura es intuitiva: un AP alto significa que el modelo mantiene buena precisión aunque suba el recall —encuentra mucho sin inventar—. Un AP medio significa que para encontrar más empieza a equivocarse. Y un AP bajo, que o inventa mucho, o encuentra poco, o las dos cosas.

Y el detalle que abre la siguiente lámina: el AP depende del umbral de IoU con que decidí qué era un acierto. Si uso IoU 0.5, se llama AP50 — de ahí viene el cincuenta. Cambiando ese umbral o promediando varios aparecen las demás variantes.`);
}
{
  const s = L("La familia de métricas AP", "Métricas · 6 de 7",
    "Todas son la misma idea; cambian el umbral de IoU, el promedio entre clases o el tamaño del objeto.");
  const cards = [
    ["AP50", "AP con la regla IoU ≥ 0.50", "La métrica principal de este trabajo. Es la que reporta la mayoría de la literatura, así que permite comparar.", AZUL],
    ["AP50-95", "promedio del AP con IoU = 0.50, 0.55 … 0.95", "Diez umbrales cada vez más exigentes. Premia la localización fina: no basta acertar, hay que encajar bien.", MORADO],
    ["mAP", "mAP = (1/K) · Σ APₖ  sobre las K clases", "Promedio del AP de cada clase. Evita que una clase abundante domine el resultado global.", VERDE],
    ["AP-small", "el mismo AP, solo sobre objetos < 32×32 px", "LA métrica de este problema: en dashcam el objeto mediano mide 22 px, así que casi todo cae en esta cubeta.", ROJO],
  ];
  cards.forEach(([t, f, d, c], i) => {
    const x = 0.62 + (i % 2) * 6.16, y = 1.95 + Math.floor(i / 2) * 2.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.9, h: 2.1,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.6 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.26, y: y + 0.14, w: 5.3, h: 0.45, fontFace: F, fontSize: 19,
      bold: true, color: c, margin: 0 });
    s.addText(f, { x: x + 0.26, y: y + 0.62, w: 5.4, h: 0.42, fontFace: F, fontSize: 12.5,
      bold: true, color: INK, margin: 0 });
    s.addText(d, { x: x + 0.26, y: y + 1.06, w: 5.4, h: 0.9, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0, valign: "top" });
  });
  s.addText([{ text: "Todas se calculan con la misma herramienta (pycocotools) contra los mismos ground truths congelados: ", options: { color: GRIS } },
             { text: "una sola vara para los 19 experimentos.", options: { bold: true, color: INK } }],
    { x: 0.62, y: 6.85, w: 12.1, h: 0.45, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[15:00 – 15:45]  [ANCLA]

La familia completa. Todas son la misma idea; lo que cambia es el umbral de IoU, el promedio entre clases o el tamaño del objeto que se considera.

AP50 es el AP con IoU 0.5. Es la métrica principal de este trabajo, y la elegí porque es la que reporta la mayoría de la literatura: me permite comparar.

AP50-95 promedia el AP con diez umbrales, del 0.5 al 0.95, cada vez más exigentes. Premia la localización fina: no basta con acertar, hay que encajar bien.

mAP es el promedio del AP de cada clase. Sirve cuando hay varias clases y evita que la más abundante domine el resultado.

Y AP-small es el mismo AP pero contado solo sobre objetos de menos de 32 por 32 píxeles. Esa es la métrica de este problema: en dashcam el objeto mediano mide 22 píxeles, así que casi todo cae en esa cubeta.

Todas se calculan con la misma herramienta, pycocotools, contra los mismos ground truths congelados. Una sola vara para los diecinueve experimentos.`);
}
{
  const s = L("Cómo se miden las otras dos tareas", "Métricas · 7 de 7",
    "La detección usa AP; la segmentación y la clasificación necesitan sus propias varas.");
  card(s, 0.62, 2.0, 3.9, 2.5, VERDE, "Segmentación → IoU de máscara",
    "La misma intersección sobre unión, pero contada sobre píxeles en lugar de cajas.\n\nResponde: ¿qué tan bien coincide la región marcada como basura con la región real?", { bf: 11.5 });
  card(s, 4.72, 2.0, 3.9, 2.5, AZUL, "Clasificación → exactitud",
    "Aciertos sobre el total de recortes clasificados.\n\nAquí sí funciona, porque en clasificación el verdadero negativo está bien definido: un recorte de fondo correctamente rechazado.", { bf: 11.5 });
  card(s, 8.82, 2.0, 3.9, 2.5, MORADO, "Diagnóstico → TIDE",
    "No mide rendimiento: descompone el error.\n\nResponde: si corrijo un solo tipo de error, ¿cuántos puntos de AP recupero? Ese valor se llama dAP.", { bf: 11.5 });
  s.addText("Los seis tipos de error que separa TIDE:", { x: 0.62, y: 4.85, w: 6, h: 0.4,
    fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  const errs = [["Cls", "clasificó mal", AZUL], ["Loc", "ubicó mal", AZUL_S],
                ["Both", "ambos", MORADO], ["Dupe", "detectó dos veces", GRIS2],
                ["Bkg", "vio algo donde no hay", AMBAR], ["Miss", "no lo vio", ROJO]];
  errs.forEach(([t, d, c], i) => {
    const x = 0.62 + i * 2.03;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.35, w: 1.9, h: 0.95,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.5 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.12, y: 5.45, w: 1.66, h: 0.32, fontFace: F, fontSize: 13,
      bold: true, color: c, align: "center", margin: 0 });
    s.addText(d, { x: x + 0.08, y: 5.76, w: 1.74, h: 0.45, fontFace: F, fontSize: 9.5,
      color: GRIS, align: "center", margin: 0 });
  });
  pie(s, "TIDE reaparece en resultados: es la herramienta que revela qué está fallando realmente en cada modelo.");
  s.addNotes(`[15:45 – 16:30]  [ANCLA]

Para cerrar métricas: la detección usa AP, pero las otras dos tareas necesitan sus propias varas.

La segmentación usa IoU de máscara: la misma intersección sobre unión, pero contada sobre píxeles en lugar de cajas. Responde qué tan bien coincide la región marcada como basura con la región real.

La clasificación sí usa exactitud —aciertos sobre total—, y aquí sí funciona, porque en clasificación el verdadero negativo está bien definido: es un recorte de fondo correctamente rechazado. Ese era el problema que no existía en detección.

Y TIDE no es una métrica de rendimiento: es una herramienta de diagnóstico. Responde: si corrijo un solo tipo de error, ¿cuántos puntos de AP recupero? Ese valor se llama dAP, y separa seis tipos de error: clasificar mal, ubicar mal, ambos, duplicar una detección, ver algo donde no hay, y no ver lo que sí estaba.

TIDE va a reaparecer en resultados, porque es la que revela qué está fallando realmente en cada modelo.`);
}

// ═══ 5 · PROPUESTA Y DESARROLLO ══════════════════════════════════════════════
Sec("05", "La propuesta y el desarrollo", "La estrategia, la auditoría de los datos y cómo se ejecutaron 19 experimentos")
  .addNotes(`[16:30 – 16:35]  [PASO]  Separador.`);
{
  const s = L("La estrategia: tres decisiones antes de entrenar", "La propuesta");
  const dec = [
    ["1", "Desconfiar de los datos primero", "Los datasets vienen publicados y revisados por pares, pero eso no garantiza que sus particiones sean correctas. Auditar antes de entrenar cuesta días; descubrirlo después cuesta el trabajo entero.", ROJO],
    ["2", "Separar los datos en capas con contrato", "Cada capa tiene una única responsabilidad y se verifica contra la anterior con una firma criptográfica. Si algo falla, sé exactamente en qué capa y reconstruyo desde ahí sin rehacer todo.", AZUL],
    ["3", "Una sola vara de evaluación", "Los 19 experimentos —cuatro familias de modelos distintas— se miden con la misma herramienta contra los mismos ground truths congelados. Sin eso, comparar familias no significaría nada.", VERDE],
  ];
  dec.forEach(([n, t, d, c], i) => {
    const y = 1.95 + i * 1.62;
    s.addShape(pres.shapes.OVAL, { x: 0.62, y, w: 0.62, h: 0.62,
      fill: { color: c }, line: { color: c, width: 0 } });
    s.addText(n, { x: 0.62, y: y + 0.09, w: 0.62, h: 0.42, fontFace: F, fontSize: 18,
      bold: true, color: BG, align: "center", margin: 0 });
    s.addText(t, { x: 1.45, y: y - 0.02, w: 11.2, h: 0.42, fontFace: F, fontSize: 16,
      bold: true, color: INK, margin: 0 });
    s.addText(d, { x: 1.45, y: y + 0.42, w: 11.2, h: 0.95, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[16:35 – 17:25]  [ANCLA]

Antes de mostrar el diagrama del pipeline, quiero explicar las tres decisiones de estrategia que lo determinan. Porque el diagrama es la consecuencia, no la causa.

Primera: desconfiar de los datos. Los datasets vienen publicados y revisados por pares, pero eso no garantiza que sus particiones sean correctas. Auditar antes de entrenar cuesta unos días; descubrirlo después cuesta el trabajo entero. Ya van a ver que esta decisión se pagó sola.

Segunda: separar los datos en capas con contrato explícito. Cada capa tiene una sola responsabilidad y se verifica contra la anterior con una firma criptográfica. Si algo falla, sé exactamente en qué capa, y reconstruyo desde ahí sin rehacer todo.

Tercera: una sola vara de evaluación. Los diecinueve experimentos son de cuatro familias de modelos distintas, y se miden con la misma herramienta contra los mismos ground truths congelados. Sin eso, comparar un Faster R-CNN con un YOLO no significaría nada.`);
}
{
  const s = L("El pipeline que resulta de esas decisiones", "La propuesta",
    "Cuatro capas de datos, dos carriles de cómputo y un único contrato de evaluación.");
  await fit(s, A("pipeline.png"), 0.35, 2.0, 12.63, 2.4);
  const pies = [["raw → bronze → silver → gold", "cada capa se verifica con SHA-256 contra la anterior; los números sobre las flechas son las notebooks que las producen"],
                ["Dos carriles de cómputo", "el hardware se elige por medición, no por preferencia — lo explico en dos láminas más"],
                ["Un solo contrato de evaluación", "todo desemboca en la misma medición: pycocotools contra ground truths congelados"]];
  pies.forEach(([t, d], i) => {
    const x = 0.62 + i * 4.18;
    s.addText(t, { x, y: 4.85, w: 3.9, h: 0.4, fontFace: F, fontSize: 13, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x, y: 5.25, w: 3.9, h: 1.1, fontFace: F, fontSize: 11.5, color: GRIS, margin: 0 });
  });
  pie(s, "Todo el pipeline es reejecutable: cada flecha corresponde a una notebook publicada en el repositorio.");
  s.addNotes(`[17:25 – 18:05]  [PASO larga]

Este es el pipeline que resulta.

Los datos entran por la izquierda desde las fuentes públicas y pasan por cuatro capas. Raw es inmutable, con verificación de checksums. Bronze está descomprimido y navegable. Silver es donde vive toda la curación y la auditoría. Y gold tiene los formatos ya listos para entrenar.

Cada capa se verifica contra la anterior, y los números que ven sobre las flechas son las notebooks que las producen: la 00 descarga, la 01 y 02 auditan y curan, la 03 exporta.

Abajo, los dos carriles de cómputo, que explico en un momento, y todo desemboca en el contrato de evaluación único.`);
}
{
  const s = L("La auditoría encontró siete defectos", "La propuesta · auditoría",
    "Verificaciones sistemáticas sobre los datasets publicados, antes de entrenar nada.");
  const hall = [
    ["H1", "TACO: colisión de nombres", "1 386 de 1 500 imágenes comparten nombre de archivo entre lotes distintos", AMBAR],
    ["H2", "TACO: rotación EXIF pendiente", "~37 % se ven giradas al abrirlas; las cajas están anotadas sobre la imagen ya girada", AMBAR],
    ["H3", "RoLID: la carpeta no es la hora", "los directorios 0–23 parecen horas del día, pero son índices de sesión", GRIS2],
    ["H4", "RoLID: fuga de video en los splits oficiales", "58.2 % del test comparte video de origen con el entrenamiento", ROJO],
    ["H5", "RoLID: duplicado entre val y test", "una imagen aparece en los dos conjuntos, más una categoría fantasma sin anotaciones", AMBAR],
    ["H6", "UAVVaste: la misma fuga en miniatura", "un par de cuadros casi idénticos del mismo vuelo, repartidos entre train y test", AMBAR],
    ["H7", "Marcos de anotación inconsistentes", "TACO anota sobre la imagen girada; cinco fotos de UAVVaste, sobre la imagen cruda", AMBAR],
  ];
  hall.forEach(([cod, t, d, c], i) => {
    const y = 1.95 + i * 0.68;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 0.72, h: 0.56,
      fill: { color: c === ROJO ? c : BG_SUAVE }, line: { color: c, width: 1.4 }, rectRadius: 0.04 });
    s.addText(cod, { x: 0.62, y: y + 0.11, w: 0.72, h: 0.34, fontFace: F, fontSize: 12.5,
      bold: true, color: c === ROJO ? BG : c, align: "center", margin: 0 });
    s.addText(t, { x: 1.5, y: y + 0.03, w: 4.5, h: 0.5, fontFace: F, fontSize: 12,
      bold: true, color: c === ROJO ? ROJO : INK, margin: 0 });
    s.addText(d, { x: 6.1, y: y + 0.05, w: 6.6, h: 0.5, fontFace: F, fontSize: 11,
      color: GRIS, margin: 0 });
  });
  pie(s, "Cada hallazgo se corrigió o se documentó explícitamente. El siguiente, H4, es el que cambia conclusiones publicadas.");
  s.addNotes(`[18:05 – 19:00]  [ANCLA]

Estos son los siete defectos que encontré. No los voy a leer todos, pero quiero que vean que no es una anécdota: es un patrón.

En TACO, los nombres de archivo colisionan entre lotes —mil trescientas ochenta y seis de mil quinientas imágenes comparten nombre— y un 37 % tiene una rotación pendiente que hace que la imagen se vea girada según con qué programa la abras.

En RoLID, las carpetas que parecen horas del día en realidad son índices de sesión; hay una imagen duplicada entre validación y test; y está el hallazgo H4, en rojo, que es el grave.

En UAVVaste encontré la misma fuga que en RoLID pero en miniatura. Y el séptimo: los marcos de anotación no son consistentes entre datasets.

Cada uno se corrigió o se documentó. Ahora déjenme detenerme en el H4, porque es el que cambia conclusiones ya publicadas.`);
}
{
  const s = L("H4: fuga de video en los splits oficiales de RoLID-11K", "La propuesta · el hallazgo grave");
  s.addText("El dataset son cuadros extraídos de videos. Los splits oficiales los reparten sin considerar de qué video viene cada uno:",
    { x: 0.62, y: 1.8, w: 12.1, h: 0.45, fontFace: F, fontSize: 13, color: GRIS, margin: 0 });
  s.addText("un mismo video, cuadros consecutivos", { x: 1.0, y: 2.25, w: 5, h: 0.3,
    fontFace: F, fontSize: 10.5, italic: true, color: GRIS2, margin: 0 });
  const asig = ["TRAIN", "TRAIN", "TEST", "TRAIN", "TEST"];
  for (let i = 0; i < 5; i++) {
    const x = 1.0 + i * 2.4, esTest = asig[i] === "TEST";
    const c = esTest ? ROJO : AZUL;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.6, w: 2.05, h: 1.3,
      fill: { color: esTest ? "FDECEA" : "EAF0FC" }, line: { color: c, width: 1.8 }, rectRadius: 0.05 });
    s.addText("cuadro " + (i + 1), { x, y: 3.02, w: 2.05, h: 0.4, fontFace: F, fontSize: 12,
      color: INK, align: "center", margin: 0 });
    s.addText(asig[i], { x, y: 3.98, w: 2.05, h: 0.32, fontFace: F, fontSize: 11.5,
      bold: true, color: c, align: "center", margin: 0 });
  }
  cifra(s, 0.62, 4.55, 3.9, "58.2 %", "de los cuadros de test comparte video de origen con el entrenamiento", ROJO);
  cifra(s, 4.72, 4.55, 3.9, "87 %", "de los pares de cuadros del mismo video son casi idénticos (hash perceptual)", ROJO);
  cifra(s, 8.82, 4.55, 3.9, "22 de 84", "videos de origen reparten sus cuadros en más de un split", ROJO);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 6.3, w: 12.1, h: 0.75,
    fill: { color: BG_SUAVE }, line: { color: GRANATE, width: 1.5 }, rectRadius: 0.05 });
  s.addText([{ text: "Consecuencia: ", options: { bold: true, color: GRANATE } },
             { text: "el modelo no generaliza, recuerda. Los baselines publicados sobre este protocolo están inflados — y en resultados voy a mostrar exactamente cuánto.", options: { color: INK } }],
    { x: 0.95, y: 6.48, w: 11.5, h: 0.45, fontFace: F, fontSize: 13, margin: 0 });
  s.addNotes(`[19:00 – 19:50]  [ANCLA]

Este es el hallazgo grave, y es fácil de explicar.

RoLID son cuadros extraídos de videos. Los splits oficiales los reparten entre entrenamiento y test sin considerar de qué video viene cada cuadro. Aquí ven cinco cuadros consecutivos del mismo video: tres caen en entrenamiento y dos en test.

El problema es que cuadros consecutivos de un video son casi la misma imagen. Lo medí con hash perceptual: el 87 % de los pares dentro de un mismo video son casi idénticos.

Los números: el 58.2 % de los cuadros de test comparte video de origen con el entrenamiento. Veintidós de los ochenta y cuatro videos reparten sus cuadros en más de un split.

La consecuencia es que el modelo no está generalizando: está recordando escenas que ya vio. Los baselines publicados sobre este protocolo están inflados, y en resultados les voy a mostrar exactamente cuánto.`);
}
{
  const s = L("La corrección: partir por grupos, no por imagen", "La propuesta · corrección");
  card(s, 0.62, 1.95, 5.95, 2.15, ROJO, "Partición ingenua (por imagen)",
    "Se barajan todas las imágenes y se reparten al azar.\n\nProblema: dos cuadros casi idénticos del mismo video pueden caer uno en entrenamiento y otro en test.", { bf: 12 });
  card(s, 6.78, 1.95, 5.95, 2.15, VERDE, "Partición consciente de grupos",
    "Primero se agrupan las imágenes que comparten origen; el grupo completo va a un solo lado.\n\nUnidad de grupo: el video de origen (RoLID) o el grupo visual por hash perceptual (TACO, UAVVaste).", { bf: 12 });
  s.addText("Y para que los splits sigan siendo representativos:", { x: 0.62, y: 4.35, w: 8, h: 0.4,
    fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  const det = [
    ["Estratificación iterativa", "reparte los grupos buscando que cada clase mantenga su proporción (Sechidis et al., 2011)", AZUL],
    ["Resultado verificado", "todas las clases quedan entre 15.0 % y 15.1 % en el conjunto de test", VERDE],
    ["Se conservan ambos esquemas", "el oficial (con fuga) para comparar con la literatura, y el corregido para medir de verdad", GRANATE],
  ];
  det.forEach(([t, d, c], i) => {
    const x = 0.62 + i * 4.18;
    card(s, x, 4.85, 3.9, 1.7, c, t, d, { bf: 11.5, tf: 13 });
  });
  pie(s, "Los splits corregidos se publicaron como recurso reutilizable, para que otros trabajos sobre RoLID-11K puedan evaluar sin fuga.");
  s.addNotes(`[19:50 – 20:30]  [ANCLA]

¿Cómo se corrige? Cambiando la unidad de partición.

La partición ingenua baraja todas las imágenes y las reparte al azar. El problema es evidente ahora: dos cuadros casi idénticos del mismo video pueden caer uno en entrenamiento y otro en test.

La partición consciente de grupos primero agrupa las imágenes que comparten origen, y manda el grupo completo a un solo lado. Para RoLID, la unidad de grupo es el video; para TACO y UAVVaste, un grupo visual calculado con hash perceptual.

Para que los splits sigan siendo representativos uso estratificación iterativa, un método publicado que reparte los grupos cuidando que cada clase mantenga su proporción. Lo verifiqué: todas las clases quedan entre 15.0 y 15.1 por ciento en test.

Y una decisión importante: conservo los dos esquemas. El oficial, con fuga, para poder comparar con la literatura; y el corregido, para medir de verdad. Tener los dos es lo que después me permite cuantificar la inflación.`);
}
{
  const s = L("Configuración experimental · datos y protocolo", "La propuesta · setup 1 de 2");
  card(s, 0.62, 1.95, 3.9, 2.35, AZUL, "Cómo se parten los datos", "", {});
  lista(s, ["70 % entrenamiento", "15 % validación", "15 % test",
            "unidad de partición: el grupo, no la imagen",
            "splits congelados y versionados"], 0.85, 2.5, 3.5, 1.7, 11.5);
  card(s, 4.72, 1.95, 3.9, 2.35, VERDE, "Para qué sirve cada conjunto", "", {});
  lista(s, ["entrenamiento: ajusta los pesos",
            "validación: elige el mejor punto y decide cuándo parar",
            "test: se toca UNA sola vez, al final, con los pesos de mejor validación"],
        4.95, 2.5, 3.5, 1.7, 11.5);
  card(s, 8.82, 1.95, 3.9, 2.35, GRANATE, "Qué garantiza la comparación", "", {});
  lista(s, ["ground truths congelados",
            "misma herramienta de evaluación para las 4 familias",
            "predicciones guardadas para poder reauditar"],
        9.05, 2.5, 3.5, 1.7, 11.5);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 4.6, w: 12.1, h: 1.9,
    fill: { color: BG_SUAVE }, line: { color: GRIS2, width: 1.4 }, rectRadius: 0.05 });
  s.addText("Por qué el test se toca una sola vez", { x: 0.95, y: 4.78, w: 11.5, h: 0.4,
    fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
  s.addText("Si uno mira el resultado de test y luego ajusta algo —la tasa de aprendizaje, un umbral, la arquitectura— y vuelve a medir, el test deja de ser una medición independiente: se convierte, poco a poco, en un segundo conjunto de validación, y el número final ya no dice cómo se comportará el modelo con datos nuevos. Por eso todas las decisiones de este trabajo se tomaron mirando validación, y el test se ejecutó una vez por experimento.",
    { x: 0.95, y: 5.2, w: 11.5, h: 1.2, fontFace: F, fontSize: 12.5, color: GRIS, margin: 0, valign: "top" });
  s.addNotes(`[20:30 – 21:15]  [ANCLA]

La configuración experimental, primera parte: los datos.

La partición es 70 % entrenamiento, 15 % validación, 15 % test, con la unidad de grupo que acabo de explicar, y los splits quedan congelados y versionados.

Cada conjunto tiene un rol distinto. Entrenamiento ajusta los pesos. Validación elige el mejor punto del entrenamiento y decide cuándo parar. Y test se toca una sola vez, al final, con los pesos de mejor validación.

Quiero explicar por qué eso importa, porque es una decisión metodológica, no un capricho. Si uno mira el resultado de test y después ajusta algo —la tasa de aprendizaje, un umbral, la arquitectura— y vuelve a medir, el test deja de ser una medición independiente: se convierte poco a poco en un segundo conjunto de validación, y el número final ya no dice cómo se comportará el modelo con datos nuevos.

Por eso todas las decisiones de este trabajo se tomaron mirando validación, y el test se ejecutó una sola vez por experimento.`);
}
{
  const s = L("Configuración experimental · entrenamiento", "La propuesta · setup 2 de 2");
  const bl = [
    ["Estabilidad del entrenamiento", [
      "warmup lineal: la tasa de aprendizaje arranca baja y sube gradualmente",
      "recorte de gradiente: evita saltos que rompan el modelo",
      "ambas vienen de un problema real: una corrida divergió y registró 11 épocas en NaN"], ROJO],
    ["Cuándo se detiene", [
      "tope de 50 a 150 épocas según el experimento",
      "early stopping: para si la validación no mejora en 8 a 30 épocas",
      "checkpoint por época: se puede reanudar donde quedó"], AZUL],
    ["Entrada e imágenes", [
      "imágenes materializadas a 1 280 px de lado máximo",
      "entrenamiento a 640 px, y a 1 024 px para la ablación de resolución",
      "aumentación: mosaico, volteo horizontal y variación de color"], VERDE],
    ["Reproducibilidad", [
      "semilla fija (42) y ejecución determinista",
      "registro por corrida con métricas o traza del fallo",
      "todo publicado y reejecutable desde el repositorio"], GRANATE],
  ];
  bl.forEach(([t, items, c], i) => {
    const x = 0.62 + (i % 2) * 6.16, y = 1.95 + Math.floor(i / 2) * 2.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.9, h: 2.2,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.5 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.26, y: y + 0.13, w: 5.4, h: 0.4, fontFace: F, fontSize: 14,
      bold: true, color: INK, margin: 0 });
    lista(s, items, x + 0.26, y + 0.58, 5.42, 1.55, 11);
  });
  s.addNotes(`[21:15 – 22:10]  [ANCLA]

Segunda parte del setup: el entrenamiento. Quiero detenerme sobre todo en el bloque de la resolución, porque conecta directamente con el resultado principal.

Para la estabilidad uso warmup lineal —la tasa de aprendizaje arranca baja y sube gradualmente— y recorte de gradiente. Las dos medidas no son decorativas: vienen de un problema real, una corrida que divergió y registró once épocas en NaN.

Para detener: tope de cincuenta a ciento cincuenta épocas según el experimento, con early stopping si la validación no mejora, y un checkpoint por época que permite reanudar.

Ahora la resolución, que tiene tres niveles y conviene distinguirlos.

El primero: materializo todas las imágenes a 1 280 píxeles de lado máximo. ¿Por qué? Porque los tres datasets vienen con tamaños muy distintos —TACO ronda los 3 264 píxeles de lado, RoLID son 1 920, UAVVaste llega a 3 668—. Fijar un tamaño común hace tres cosas: homogeneiza el punto de partida, hace el reescalado una sola vez y con buena calidad en lugar de repetirlo en cada época, y baja el pool de sesenta gigas a cuatro.

El segundo: entreno a 640 píxeles. Es el estándar de la familia YOLO y el equilibrio habitual entre velocidad y precisión.

Y el tercero: repito dos experimentos a 1 024 píxeles. Esa es la ablación de resolución.

Ahora la parte importante, que es cómo se conecta esto con los 22 píxeles de los que vengo hablando. Ese número está medido sobre la imagen original de dashcam, que tiene 1 920 píxeles de lado. Pero el modelo no ve esa imagen: ve la versión reescalada. Cuando entreno a 640 píxeles, ese objeto de 22 se reduce a unos siete píxeles. Siete.

Y el ancla más pequeña del detector mide 32. O sea que a la resolución real de entrenamiento, el objeto de dashcam no está apenas por debajo del ancla: está casi cinco veces por debajo.

Hagamos la misma cuenta para los otros dos dominios, porque ahí está la explicación de la matriz. TACO: 171 píxeles en la original, que a 640 quedan en unos 32 — es decir, justo en el ancla mínima. UAVVaste: 72 en la original, unos 12 a 640. Y RoLID: siete.

Ese es el orden que va a reaparecer en los resultados. TACO entra cómodo en el rango que el detector sabe mirar, UAVVaste queda en el borde, y RoLID queda fuera. Y por eso subir a 1 024 píxeles ayuda: no resuelve el problema —el objeto de dashcam pasa de siete a once píxeles, sigue por debajo del ancla— pero recupera casi la mitad del terreno perdido, y eso se traduce en los ocho puntos de mejora que voy a mostrar.

Cierro con reproducibilidad: semilla fija, registro por corrida, todo publicado.`);
}
{
  const s = L("Los 19 experimentos", "El desarrollo",
    "Cuatro familias de modelos, con las variantes que responden cada pregunta del trabajo.");
  const familias = [
    ["VGG-16", "clasificación", [["E1", "congelado\nlr alto"], ["E2", "congelado\nlr bajo"],
      ["E3", "último bloque\nlr alto"], ["E4", "último bloque\nlr bajo"]], VERDE],
    ["FCN-ResNet18", "segmentación", [["D1", "lr 0.001"], ["D2", "lr 0.0001"]], ROJO],
    ["Faster R-CNN", "detección", [["A1", "TACO\ncongelado"], ["A2", "TACO\nlayer4"],
      ["B6", "TACO\n6 clases"], ["B5", "TACO\n5 clases"], ["C", "RoLID\npor video"]], AZUL],
    ["YOLOv11n", "detección", [["F1", "TACO\n@640"], ["F2", "RoLID vid\n@640"],
      ["F3", "RoLID ofic\n@640"], ["F4", "UAV\n@640"], ["G1", "TACO\n6 cls"],
      ["G2", "TACO\n5 cls"], ["H1", "TACO\n@1024"], ["H2", "RoLID\n@1024"]], AMBAR],
  ];
  let y = 1.9;
  familias.forEach(([fam, tarea, exps, c]) => {
    s.addText(fam, { x: 0.62, y, w: 2.3, h: 0.35, fontFace: F, fontSize: 13.5, bold: true,
      color: INK, margin: 0 });
    s.addText(tarea, { x: 0.62, y: y + 0.33, w: 2.3, h: 0.3, fontFace: F, fontSize: 10.5,
      color: c, margin: 0 });
    exps.forEach(([cod, det], j) => {
      const x = 3.05 + j * 1.24;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y - 0.02, w: 1.16, h: 0.86,
        fill: { color: BG_SUAVE }, line: { color: c, width: 1.3 }, rectRadius: 0.05 });
      s.addText(cod, { x, y: y + 0.02, w: 1.16, h: 0.3, fontFace: F, fontSize: 12,
        bold: true, color: c, align: "center", margin: 0 });
      s.addText(det, { x: x + 0.03, y: y + 0.32, w: 1.1, h: 0.5, fontFace: F, fontSize: 7.5,
        color: GRIS, align: "center", margin: 0 });
    });
    y += 1.15;
  });
  s.addText("De esos 19 salen los cuatro análisis que responden la pregunta:", { x: 0.62, y: 6.45, w: 5.5, h: 0.4,
    fontFace: F, fontSize: 12.5, bold: true, color: INK, margin: 0 });
  ["matriz cross-domain", "oficial vs por video", "ablación de resolución", "6 vs 5 clases"].forEach((t, i) => {
    const x = 6.3 + i * 1.65;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 6.38, w: 1.57, h: 0.5,
      fill: { color: "F1E7E7" }, line: { color: GRANATE, width: 1.2 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.04, y: 6.44, w: 1.49, h: 0.4, fontFace: F, fontSize: 8.5,
      color: GRANATE, align: "center", margin: 0 });
  });
  s.addNotes(`[21:50 – 24:20]  [ANCLA — la más larga del bloque; hay versión corta al final]

Estos son los diecinueve experimentos, ya con los códigos que expliqué al inicio. Pero más que la lista, quiero explicar la lógica: cada grupo está diseñado para aislar una sola variable, de modo que la diferencia entre dos corridas se pueda atribuir a esa variable y no a otra cosa.

Empiezo por los cuatro VGG, porque ahí el diseño es un factorial de dos por dos y se entiende bien.

La primera variable es el congelamiento. Cuando uso una red preentrenada tengo dos opciones. La primera es congelar el cuerpo: dejo fijas todas las capas convolucionales y entreno solo la cabeza clasificadora nueva. La segunda es descongelar el último bloque convolucional y dejar que también se ajuste.

¿Por qué esa elección importa? Porque las capas de una red no aprenden lo mismo. Las primeras detectan bordes, texturas y colores: eso es universal, sirve igual para un perro que para una botella, y no vale la pena reentrenarlo. Las últimas capas, en cambio, codifican características ya específicas del dominio en que se entrenó —ImageNet, en este caso—. Descongelar solo ese último bloque permite adaptar lo específico sin tocar lo universal. Y no descongelo todo por una razón concreta: con mil quinientas imágenes, ajustar 138 millones de parámetros sobreajustaría casi con seguridad.

La segunda variable es la tasa de aprendizaje, y en transferencia es más delicada de lo que parece. Un valor alto sobre pesos preentrenados los destruye: la red olvida lo que ya sabía antes de aprender lo nuevo. Un valor bajo los ajusta con cuidado, pero si es demasiado bajo la cabeza nueva —que arranca inicializada al azar— tarda muchísimo en converger. Por eso probé 0.001 y 0.0001.

Y el resultado confirma exactamente esa teoría. La mejor combinación fue E4: descongelar el último bloque con la tasa baja, 97.8 % de exactitud. Y la peor en validación fue E3: descongelar con la tasa alta, 96.9 %. Es decir, descongelar ayuda solo si además bajo la tasa; si descongelo y mantengo la tasa alta, daño los pesos preentrenados y pierdo. Los factores interactúan, y por eso hay que probarlos en cruz y no de a uno.

En el FCN, D1 y D2, pasa lo contrario: gana la tasa alta, 0.577 contra 0.536 de IoU. Y tiene sentido, porque ahí la cabeza nueva no es un clasificador pequeño: es una convolución más una capa transpuesta que reconstruye la máscara completa. Tiene mucho más que aprender desde cero, así que agradece una tasa mayor.

En Faster R-CNN, A1 y A2 repiten la comparación de congelamiento sobre detección: descongelar la última etapa del cuerpo dio 0.483 contra 0.446, casi cuatro puntos de mejora. Consistente con lo que vimos en clasificación.

Los demás grupos aíslan variables de datos, no de entrenamiento: B6 contra B5 cambia solo la taxonomía —seis clases de material o cinco—; C entrena sobre dashcam para tener el par de comparación con YOLO; F1 a F4 cubren los cuatro dominios y alimentan la matriz cross-domain; G1 y G2 repiten la comparación de clases en la otra familia; y H1 y H2 son exactamente los mismos datos que F1 y F2 pero a 1 024 píxeles, que es la ablación de resolución.

————————————————————————————————
VERSIÓN CORTA (≈45 s, si vas con prisa):

Diecinueve experimentos, y cada grupo aísla una sola variable.

Los cuatro VGG son un factorial de dos por dos: congelar el cuerpo o descongelar el último bloque, con tasa de aprendizaje alta o baja. Ganó descongelar con tasa baja, y perdió descongelar con tasa alta: los pesos preentrenados se dañan si el paso es grande. Los factores interactúan.

En Faster R-CNN, A1 contra A2 repite esa comparación y descongelar gana casi cuatro puntos. Los demás grupos aíslan variables de datos: taxonomía, dominio y resolución.`);
}
{
  const s = L("Por qué hubo que usar dos computadoras distintas", "El desarrollo · cómputo",
    "La decisión no fue de preferencia: salió de una medición.");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 1.95, w: 5.95, h: 2.3,
    fill: { color: "FDECEA" }, line: { color: ROJO, width: 1.6 }, rectRadius: 0.05 });
  s.addText("MacBook  ·  GPU Apple (MPS)", { x: 0.9, y: 2.1, w: 5.4, h: 0.4, fontFace: F,
    fontSize: 13.5, bold: true, color: INK, margin: 0 });
  s.addText("95 s", { x: 0.9, y: 2.5, w: 2.5, h: 0.85, fontFace: F, fontSize: 42, bold: true,
    color: ROJO, margin: 0 });
  s.addText("por iteración de\nFaster R-CNN", { x: 3.3, y: 2.68, w: 3.0, h: 0.6, fontFace: F,
    fontSize: 11.5, color: GRIS, margin: 0 });
  s.addText("Causa: esta GPU recompila sus rutinas cada vez que cambia el tamaño de la entrada — y Faster R-CNN usa imágenes de tamaños variables.",
    { x: 0.9, y: 3.4, w: 5.4, h: 0.7, fontFace: F, fontSize: 11, color: GRIS, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.78, y: 1.95, w: 5.95, h: 2.3,
    fill: { color: "E9F5EE" }, line: { color: VERDE, width: 1.6 }, rectRadius: 0.05 });
  s.addText("Google Colab  ·  GPU NVIDIA A100", { x: 7.06, y: 2.1, w: 5.4, h: 0.4, fontFace: F,
    fontSize: 13.5, bold: true, color: INK, margin: 0 });
  s.addText("0.3 s", { x: 7.06, y: 2.5, w: 2.5, h: 0.85, fontFace: F, fontSize: 42, bold: true,
    color: VERDE, margin: 0 });
  s.addText("la misma iteración", { x: 9.5, y: 2.75, w: 3.0, h: 0.4, fontFace: F,
    fontSize: 11.5, color: GRIS, margin: 0 });
  s.addText("300 veces más rápido. Lo que en la Mac proyectaba entre 300 y 1 500 horas, aquí toma entre 20 minutos y 2 horas.",
    { x: 7.06, y: 3.4, w: 5.4, h: 0.7, fontFace: F, fontSize: 11, color: GRIS, margin: 0 });
  s.addText("El reparto que resultó:", { x: 0.62, y: 4.55, w: 4, h: 0.4, fontFace: F,
    fontSize: 13, bold: true, color: INK, margin: 0 });
  card(s, 0.62, 5.0, 5.95, 1.6, ROJO, "Carril MacBook",
    "VGG (E1–E4), FCN (D1–D2) y el primer YOLO (F1).\nModelos con entrada de tamaño fijo: ahí la GPU de Apple sí rinde bien.", { bf: 11.5, tf: 13 });
  card(s, 6.78, 5.0, 5.95, 1.6, VERDE, "Carril Colab",
    "Los 5 Faster R-CNN (A, B, C) y los 7 YOLO restantes.\nEntrada variable o entrenamientos largos.", { bf: 11.5, tf: 13 });
  s.addNotes(`[22:40 – 23:25]  [ANCLA]

Una parte importante del desarrollo fue el cómputo, y quiero explicar por qué, porque la decisión salió de una medición y no de una preferencia.

Medí cuánto cuesta una iteración de entrenamiento de Faster R-CNN. En la MacBook, con la GPU de Apple: 95 segundos. En una A100 de Colab: 0.3 segundos. Trescientas veces de diferencia.

La causa es técnica y concreta: la GPU de Apple recompila sus rutinas internas cada vez que cambia el tamaño de la entrada, y Faster R-CNN trabaja con imágenes de tamaños variables. Cada imagen nueva le costaba una recompilación.

Con esa medición, lo que en la Mac proyectaba entre trescientas y mil quinientas horas, en Colab toma entre veinte minutos y dos horas.

El reparto quedó así: en la MacBook los modelos con entrada de tamaño fijo —VGG, FCN y el primer YOLO—, donde esa GPU sí rinde bien. Y en Colab los cinco Faster R-CNN y los YOLO restantes.`);
}
{
  const s = L("Guardianes: convertir fallos en decisiones automáticas", "El desarrollo · infraestructura",
    "Entrenar durante días sin supervisión exige que el sistema decida solo qué hacer ante un problema.");
  const flujo = [["Arranca el\nexperimento", GRIS2], ["¿Proyección\n> 20 horas?", AMBAR],
                 ["¿La pérdida\nse volvió NaN?", ROJO], ["Entrena hasta\nconverger", VERDE]];
  flujo.forEach(([t, c], i) => {
    const x = 0.62 + i * 3.25;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.05, w: 2.75, h: 1.0,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.6 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.1, y: 2.2, w: 2.55, h: 0.75, fontFace: F, fontSize: 11.5,
      bold: true, color: INK, align: "center", margin: 0 });
    if (i < 3) flecha(s, x + 2.78, 2.35, 0.42);
  });
  const sal = [null, ["Sí → aborta y deriva\nal carril Colab", AMBAR],
               ["Sí → cuarentena y\nreintento estable", ROJO], ["Registro DONE\ncon métricas", VERDE]];
  sal.forEach((v, i) => {
    if (!v) return;
    const [t, c] = v, x = 0.62 + i * 3.25;
    s.addText("↓", { x, y: 3.1, w: 2.75, h: 0.3, fontFace: F, fontSize: 15, color: GRIS2,
      align: "center", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.43, w: 2.75, h: 0.82,
      fill: { color: c === AMBAR ? "FDF3E3" : c === ROJO ? "FDECEA" : "E9F5EE" },
      line: { color: c, width: 1.4 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.1, y: 3.56, w: 2.55, h: 0.62, fontFace: F, fontSize: 10.5,
      color: INK, align: "center", margin: 0 });
  });
  card(s, 0.62, 4.6, 3.9, 1.95, AMBAR, "Guardián de presupuesto",
    "Mide las primeras iteraciones y proyecta el costo total. Si supera 20 horas, detiene el experimento y lo marca para el otro carril.\n\nAsí se descubrió el problema de las 300×.", { bf: 11 });
  card(s, 4.72, 4.6, 3.9, 1.95, ROJO, "Guardián de divergencia",
    "Detecta cuando la pérdida se vuelve NaN o se dispara, aísla esa corrida en cuarentena y reintenta con configuración estable.\n\nNació de una corrida que registró 11 épocas en NaN como válidas.", { bf: 11 });
  card(s, 8.82, 4.6, 3.9, 1.95, VERDE, "Registro por corrida",
    "Cada experimento termina con un archivo: métricas si cerró bien, o la traza del error si falló.\n\nUn fallo individual nunca detiene la ejecución de los demás.", { bf: 11 });
  pie(s, "Regla operativa de todas las notebooks: «Run All, siempre». Lo terminado se salta, lo fallido se reintenta, lo interrumpido se reanuda desde su último checkpoint.");
  s.addNotes(`[23:25 – 24:10]  [ANCLA]

Y la segunda pieza de infraestructura: los guardianes.

El problema práctico es este: entrenar diecinueve experimentos toma días, y no puedo estar mirando la pantalla. Necesito que el sistema decida solo qué hacer ante un problema.

El flujo es el que ven arriba. Cuando arranca un experimento, el guardián de presupuesto mide las primeras iteraciones y proyecta el costo total; si supera veinte horas, lo detiene y lo marca para el otro carril. Así fue exactamente como descubrí el problema de las trescientas veces.

Si el entrenamiento sigue, el guardián de divergencia vigila la pérdida: si se vuelve NaN o se dispara, aísla la corrida en cuarentena y reintenta con una configuración estable. Este nació de un caso real: una corrida que registró once épocas en NaN como si fueran válidas.

Y todo experimento termina escribiendo un registro: métricas si cerró bien, o la traza del error si falló. Un fallo individual nunca detiene a los demás.

La regla operativa de todas las notebooks es "Run All siempre".`);
}

// ═══ 6 · RESULTADOS ══════════════════════════════════════════════════════════
Sec("06", "Resultados", "Cuatro hallazgos, cada uno respondiendo una parte de la pregunta")
  .addNotes(`[24:10 – 24:15]  [PASO]  Separador.`);
{
  const s = L("Qué voy a responder y con qué evidencia", "Resultados · guía",
    "Cada hallazgo tiene un experimento diseñado para aislarlo.");
  const g = [
    ["¿Los detectores viajan entre dominios?", "Matriz cross-domain 3×3: entreno con un dominio, evalúo en los tres", "F1, F2, F4", AZUL],
    ["¿Cuánto infla la fuga que encontré?", "Mismo test limpio, dos modelos: uno entrenado con fuga y otro sin ella", "F2, F3", ROJO],
    ["¿La resolución cierra la brecha?", "Mismos datos y modelo, cambiando solo el tamaño de entrada", "F1/H1, F2/H2", AMBAR],
    ["¿Hace falta un modelo grande?", "Faster R-CNN contra YOLOv11n sobre splits idénticos, más el diagnóstico TIDE", "A, B, C vs F, G", VERDE],
  ];
  g.forEach(([p, m, e, c], i) => {
    const y = 1.95 + i * 1.25;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 0.12, h: 1.0,
      fill: { color: c }, line: { color: c, width: 0 }, rectRadius: 0.03 });
    s.addText(p, { x: 0.95, y: y + 0.02, w: 4.6, h: 0.45, fontFace: F, fontSize: 14,
      bold: true, color: INK, margin: 0 });
    s.addText(m, { x: 5.7, y: y + 0.04, w: 5.6, h: 0.85, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 11.5, y: y + 0.16, w: 1.22, h: 0.6,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.2 }, rectRadius: 0.05 });
    s.addText(e, { x: 11.5, y: y + 0.3, w: 1.22, h: 0.35, fontFace: F, fontSize: 9,
      color: c, align: "center", margin: 0 });
  });
  pie(s, "Todos los números que siguen salen de la misma evaluación con pycocotools contra los ground truths congelados.");
  s.addNotes(`[24:15 – 24:50]  [ANCLA]

Antes de mostrar números, quiero dejar claro qué voy a responder y con qué evidencia, porque cada hallazgo tiene un experimento diseñado para aislarlo.

Primero: ¿los detectores viajan entre dominios? Lo respondo con una matriz de tres por tres: entreno con un dominio y evalúo en los tres.

Segundo: ¿cuánto infla la fuga que encontré? Lo respondo con el mismo conjunto de test limpio evaluado por dos modelos, uno entrenado con fuga y otro sin ella.

Tercero: ¿la resolución cierra la brecha? Mismos datos, mismo modelo, cambiando solo el tamaño de entrada.

Y cuarto: ¿hace falta un modelo grande? Faster R-CNN contra YOLO sobre splits idénticos, más el diagnóstico TIDE.

A la derecha están los códigos de los experimentos que alimentan cada uno.`);
}
{
  const s = L("Los cuatro números", "Resultados · resumen");
  const nums = [["−82 %", "de mAP50 al cruzar dominios", "los detectores no viajan", ROJO],
                ["+21 %", "de AP50 por la fuga del split oficial", "los baselines publicados están inflados", ROJO],
                ["+8.3", "puntos de AP50 solo por subir a 1024 px", "la palanca más barata del problema", VERDE],
                ["16×", "menos parámetros, a 1–4 puntos del grande", "el despliegue ligero es viable", VERDE]];
  nums.forEach(([n, t, d, c], i) => {
    const x = 0.62 + (i % 2) * 6.16, y = 2.0 + Math.floor(i / 2) * 2.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.9, h: 2.1,
      fill: { color: BG_SUAVE }, line: { color: c, width: 1.6 }, rectRadius: 0.05 });
    s.addText(n, { x: x + 0.3, y: y + 0.18, w: 5.3, h: 0.9, fontFace: F, fontSize: 42,
      bold: true, color: c, margin: 0 });
    s.addText(t, { x: x + 0.3, y: y + 1.1, w: 5.3, h: 0.42, fontFace: F, fontSize: 13,
      color: INK, margin: 0 });
    s.addText(d, { x: x + 0.3, y: y + 1.52, w: 5.3, h: 0.42, fontFace: F, fontSize: 11.5,
      italic: true, color: GRIS, margin: 0 });
  });
  s.addNotes(`[24:50 – 25:20]  [PASO]

Los cuatro números, y después los desgloso uno por uno.

Menos 82 por ciento de mAP50 al cruzar dominios: los detectores no viajan.

Más 21 por ciento de AP50 por la fuga del split oficial: los baselines publicados están inflados.

Más 8.3 puntos solo por subir la resolución a 1 024 píxeles: la palanca más barata del problema.

Y dieciséis veces menos parámetros quedando a uno o cuatro puntos del modelo grande: el despliegue ligero es viable.`);
}
{
  const s = L("Cómo se lee la matriz cross-domain", "Resultados · hallazgo 1 · cómo leerla",
    "Antes de los números: qué representa exactamente cada celda de esta figura.");
  await fit(s, A("p_matriz_ap50.png"), 0.62, 1.9, 5.6, 4.7);
  const guia = [
    ["Cada fila", "un modelo entrenado con ese dominio (son tres modelos distintos, no uno)", AZUL],
    ["Cada columna", "el conjunto de test contra el que se evalúa", AMBAR],
    ["La diagonal (recuadrada)", "in-domain: entrenado y evaluado en el mismo dominio. Es el caso que reporta la literatura", VERDE],
    ["Fuera de la diagonal", "cross-domain: lo que este trabajo agrega. Aquí se ve si el conocimiento transfiere", GRANATE],
  ];
  guia.forEach(([t, d, c], i) => {
    const y = 2.1 + i * 1.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.7, y, w: 0.1, h: 0.9,
      fill: { color: c }, line: { color: c, width: 0 }, rectRadius: 0.03 });
    s.addText(t, { x: 7.0, y, w: 5.7, h: 0.35, fontFace: F, fontSize: 13, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 7.0, y: y + 0.33, w: 5.7, h: 0.7, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
  });
  pie(s, "El valor de cada celda es AP50 sobre el conjunto de test correspondiente, con el mismo modelo YOLOv11n entrenado a 640 px.");
  s.addNotes(`[25:20 – 26:00]  [ANCLA]

Este es el resultado central, pero antes de dar números quiero asegurarme de que la figura se lee bien.

Cada fila es un modelo entrenado con ese dominio. Son tres modelos distintos, no uno solo: uno entrenado con TACO, otro con RoLID, otro con UAVVaste.

Cada columna es el conjunto de test contra el que evalúo.

La diagonal, que está recuadrada, es el caso in-domain: entrenado y evaluado en el mismo dominio. Ese es el caso que reporta la literatura.

Y fuera de la diagonal está lo que este trabajo agrega: el caso cross-domain, donde se ve si el conocimiento realmente transfiere de un punto de vista a otro.

Ahora sí, los números.`);
}
{
  const s = L("Los detectores no viajan", "Resultados · hallazgo 1");
  await fit(s, A("p_matriz_ap50.png"), 0.4, 1.85, 5.5, 4.6);
  cifra(s, 6.3, 1.95, 3.0, "0.639", "AP50 medio en la diagonal (in-domain)", VERDE);
  cifra(s, 9.6, 1.95, 3.1, "0.118", "AP50 medio fuera de la diagonal", ROJO);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.3, y: 3.65, w: 6.4, h: 0.7,
    fill: { color: "FDECEA" }, line: { color: ROJO, width: 1.5 }, rectRadius: 0.05 });
  s.addText("Una caída del 82 % al salir del dominio de entrenamiento", { x: 6.5, y: 3.8, w: 6.1, h: 0.42,
    fontFace: F, fontSize: 14, bold: true, color: ROJO, margin: 0 });
  s.addText("Pero lo interesante es la asimetría:", { x: 6.3, y: 4.55, w: 6.4, h: 0.35,
    fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  const asim = [
    ["Dashcam es una isla", "no supera 0.064 en ninguna dirección: ni recibe ni entrega conocimiento", ROJO],
    ["Mano → dron retiene el 68 %", "0.527 contra los 0.779 que logra el modelo entrenado con dron", VERDE],
  ];
  asim.forEach(([t, d, c], i) => {
    const y = 5.0 + i * 0.85;
    s.addText(t, { x: 6.3, y, w: 6.4, h: 0.33, fontFace: F, fontSize: 12.5, bold: true,
      color: c, margin: 0 });
    s.addText(d, { x: 6.3, y: y + 0.31, w: 6.4, h: 0.45, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
  });
  s.addText("La causa: a 640 px de entrada, TACO queda en ~32 px (justo en el ancla mínima) y UAVVaste en ~12; RoLID, en ~7.",
    { x: 6.3, y: 6.7, w: 6.4, h: 0.45, fontFace: F, fontSize: 11, italic: true, color: GRANATE, margin: 0 });
  s.addNotes(`[26:00 – 26:55]  [ANCLA]

Los números. La diagonal promedia 0.639 de AP50. Fuera de la diagonal, 0.118. Una caída del 82 por ciento al salir del dominio de entrenamiento.

Pero el promedio esconde lo más interesante, que es la asimetría.

Dashcam es una isla: no supera 0.064 en ninguna dirección. Ni recibe conocimiento de los otros dominios, ni se lo entrega. Miren la fila y la columna del centro: prácticamente ceros.

En cambio, el modelo entrenado con fotos de mano evaluado sobre imágenes de dron logra 0.527, que es el 68 % de lo que logra el modelo entrenado específicamente con dron. Transfiere bastante bien.

¿Por qué esa diferencia? Volvamos a las anclas, con las cuentas del setup. A la resolución de entrada de 640 píxeles, los objetos de TACO quedan en unos 32 —justo en el ancla mínima— y los de UAVVaste en unos 12. Los de RoLID, en siete. TACO y UAVVaste están dentro o en el borde del rango que el detector sabe mirar; RoLID está muy fuera. Por eso esos dos se transfieren algo entre sí y dashcam no se comunica con ninguno.

O sea: lo que separa a los dominios no es principalmente la apariencia, es la escala del objeto. Y eso responde la primera parte de la pregunta.`);
}
{
  const s = L("La higiene de los datos cambia las conclusiones", "Resultados · hallazgo 2",
    "Tres mediciones sobre RoLID que aíslan el efecto de la fuga encontrada en la auditoría.");
  await fit(s, A("p_fuga.png"), 0.5, 1.9, 7.3, 4.6);
  card(s, 8.1, 1.95, 4.6, 1.55, GRIS2, "Barra 1 · el baseline publicado",
    "Entrenado y evaluado con el split oficial. Es el número que reporta la literatura: 0.620.", { bf: 11.5, tf: 12.5 });
  card(s, 8.1, 3.62, 4.6, 1.55, VERDE, "Barra 2 · la medición honesta",
    "Entrenado y evaluado sin fuga, con el split por video: 0.695.", { bf: 11.5, tf: 12.5 });
  card(s, 8.1, 5.29, 4.6, 1.55, ROJO, "Barra 3 · la prueba de la fuga",
    "El modelo con fuga, evaluado sobre el test limpio: 0.844. Mismo test que la barra 2, pero vio esos videos al entrenar.", { bf: 11.5, tf: 12.5 });
  s.addNotes(`[26:55 – 27:50]  [ANCLA]

Segundo hallazgo: cuánto infla la fuga. Y este es el experimento del que estoy más satisfecho, porque aísla el efecto de forma limpia.

Hay tres mediciones, todas sobre RoLID.

La primera barra es el baseline publicado: entrenado y evaluado con el split oficial. Da 0.620. Es el número que reporta la literatura.

La segunda barra es la medición honesta: entrenado y evaluado sin fuga, con el split por video. Da 0.695.

Y la tercera es la prueba. Tomo el modelo entrenado con el split oficial —el que vio cuadros de los videos del test— y lo evalúo sobre el test limpio. Da 0.844.

Comparen la segunda y la tercera: exactamente el mismo conjunto de evaluación, quince puntos de diferencia. Un veintiuno por ciento relativo. Esa diferencia no es aprendizaje, es memoria de escena: el modelo reconoce lugares que ya vio.

Y lo importante para la comunidad: corregirlo no cuesta nada, solo cambiar cómo se parten los datos. Publiqué los splits corregidos para que otros trabajos puedan usarlos.`);
}
{
  const s = L("La resolución paga donde los objetos son pequeños", "Resultados · hallazgo 3",
    "Mismo modelo, mismos datos, mismo protocolo: lo único que cambia es el tamaño de entrada.");
  await fit(s, A("p_ablacion.png"), 0.5, 1.95, 9.0, 3.3);
  card(s, 9.75, 2.0, 2.95, 1.55, AMBAR, "Dashcam",
    "+8.3 puntos de AP50\n+5.8 de AP-small", { bf: 12.5, tf: 13 });
  card(s, 9.75, 3.7, 2.95, 1.55, AZUL, "Mano",
    "+3.2 puntos de AP50\n+3.9 de AP-small", { bf: 12.5, tf: 13 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y: 5.55, w: 12.1, h: 1.15,
    fill: { color: BG_SUAVE }, line: { color: GRANATE, width: 1.5 }, rectRadius: 0.05 });
  s.addText([{ text: "Por qué funciona:  ", options: { bold: true, color: GRANATE } },
             { text: "a 640 px de entrada el objeto mediano de dashcam queda en unos 7 px, casi 5× por debajo del ancla más pequeña (32 px); a 1 024 px sube a unos 11. Sigue por debajo, pero recupera terreno — y esa recuperación parcial ya vale 8.3 puntos. No cambié el modelo: solo acerqué el objeto al tamaño que el detector sabe mirar.", options: { color: INK } }],
    { x: 0.95, y: 5.75, w: 11.5, h: 0.8, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[27:50 – 28:30]  [ANCLA]

Tercer hallazgo, y responde la segunda parte de la pregunta: ¿la resolución cierra la brecha?

El experimento es limpio: mismo modelo, mismos datos, mismo protocolo. Lo único que cambia es el tamaño con que entra la imagen: 640 o 1 024 píxeles.

En dashcam, la ganancia es de 8.3 puntos de AP50 y 5.8 de AP-small. En mano, de 3.2 y 3.9. La ganancia se concentra donde los objetos son más pequeños.

¿Por qué funciona? Recuerden la cuenta del setup: a 640 píxeles de entrada, el objeto mediano de dashcam queda en unos siete píxeles, casi cinco veces por debajo del ancla más pequeña. Al subir a 1 024 sube a unos once. Sigue estando por debajo, pero recupera parte del terreno, y esa recuperación parcial ya vale 8.3 puntos.

No cambié el modelo: solo acerqué el objeto al tamaño que el detector sabe mirar. Por eso digo que es la palanca más barata del problema — y también por qué no basta: aun a 1 024 píxeles el objeto sigue por debajo del ancla mínima.`);
}
{
  const s = L("Un modelo 16 veces más pequeño compite de igual a igual", "Resultados · hallazgo 4a",
    "Faster R-CNN (41.3 M parámetros) contra YOLOv11n (2.6 M), sobre splits idénticos.");
  await fit(s, A("p_familias.png"), 0.5, 1.95, 8.0, 3.9);
  card(s, 8.75, 2.05, 3.95, 1.75, VERDE, "En tareas de una clase",
    "La diferencia es de 1 a 4 puntos: 0.695 contra 0.707 en dashcam.\nEl despliegue ligero es viable.", { bf: 11.5, tf: 13 });
  card(s, 8.75, 3.95, 3.95, 1.9, AMBAR, "En clasificación de materiales",
    "La diferencia se abre a 5–9 puntos: el modelo grande sí aporta cuando hay que distinguir entre clases.", { bf: 11.5, tf: 13 });
  s.addText("Y una referencia externa para calibrar: TrashDet (WACV-W 2026), con búsqueda de arquitectura dedicada, reporta 19.5 mAP50 en un subconjunto comparable de TACO. Mi modelo de 5 clases da 19.2 sin búsqueda alguna: las cifras bajas son propias del problema, no del modelo.",
    { x: 0.62, y: 6.15, w: 12.1, h: 0.7, fontFace: F, fontSize: 11.5, color: GRIS, margin: 0 });
  s.addNotes(`[28:30 – 29:10]  [ANCLA]

Cuarto hallazgo, primera parte: ¿hace falta un modelo grande?

Comparo Faster R-CNN, con 41.3 millones de parámetros, contra YOLOv11n, con 2.6 millones. Dieciséis veces menos. Sobre splits idénticos y con la misma vara.

En tareas de una sola clase —detectar basura, sin decir de qué material— la diferencia es de uno a cuatro puntos. En dashcam, 0.695 contra 0.707. Prácticamente empatan. Eso es lo que sostiene el argumento del despliegue ligero.

En clasificación de materiales la diferencia se abre a cinco o nueve puntos: ahí el modelo grande sí aporta.

Y déjenme dar una referencia externa para calibrar, porque los números absolutos pueden parecer bajos. TrashDet, publicado este año con búsqueda de arquitectura dedicada, reporta 19.5 de mAP50 en un subconjunto comparable de TACO. Mi modelo de cinco clases da 19.2, sin búsqueda alguna. Las cifras bajas son propias de este problema, no de un error de modelado.`);
}
{
  const s = L("Qué está fallando realmente: el diagnóstico TIDE", "Resultados · hallazgo 4b",
    "Cuántos puntos de AP recuperaría cada modelo si corrigiera un solo tipo de error.");
  await fit(s, A("p_tide.png"), 0.5, 1.9, 7.6, 4.6);
  card(s, 8.4, 1.95, 4.3, 1.75, AZUL, "En los modelos multiclase",
    "Hasta 24.6 dAP se pierden por clasificación, contra 1.7 por localización.\nEncontrar la basura no es el problema: nombrar su material, sí.", { bf: 11.5, tf: 13 });
  card(s, 8.4, 3.85, 4.3, 1.6, ROJO, "En dashcam, in-domain",
    "El error por objetos no detectados (Miss) no pasa de 3.9.\nLos objetos de 22 px sí se encuentran.", { bf: 11.5, tf: 13 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y: 5.6, w: 4.3, h: 1.05,
    fill: { color: "F1E7E7" }, line: { color: GRANATE, width: 1.5 }, rectRadius: 0.05 });
  s.addText("Esto reencuadra el problema: el colapso cross-domain no viene de un piso de recall irrecuperable, sino de las representaciones.",
    { x: 8.62, y: 5.75, w: 3.9, h: 0.85, fontFace: F, fontSize: 11.5, bold: true, color: GRANATE, margin: 0 });
  s.addNotes(`[29:10 – 30:00]  [ANCLA]

Y la segunda parte del cuarto hallazgo, que para mí es el resultado más interesante del trabajo, porque no lo esperaba.

TIDE responde: si corrijo un solo tipo de error, ¿cuánto AP recupero? Cada barra es un modelo, y los colores son los tipos de error.

Primero, en los modelos multiclase, la barra azul —clasificación— domina: hasta 24.6 puntos de dAP, contra apenas 1.7 de localización. Es decir, encontrar la basura no es el problema; nombrar de qué material es, sí lo es.

Y segundo, lo contraintuitivo: en los modelos de dashcam evaluados in-domain, el error por objetos no detectados —Miss, la barra roja— no pasa de 3.9. O sea, los objetos de 22 píxeles sí se encuentran cuando el modelo fue entrenado en ese dominio.

Eso reencuadra el problema completo. Yo esperaba que el colapso cross-domain viniera de que los objetos pequeños simplemente no se ven. Y no: se ven. El colapso viene de las representaciones, de que las características aprendidas en un dominio no describen bien al otro.

Esa distinción cambia qué habría que hacer para arreglarlo.`);
}

// ═══ 7 · CIERRE ══════════════════════════════════════════════════════════════
Sec("07", "Cierre", "Limitaciones, retos superados, lecciones y trabajo futuro")
  .addNotes(`[30:00 – 30:05]  [PASO]  Separador.`);
{
  const s = L("Limitaciones del estudio", "Cierre · 1 de 4",
    "Lo que este trabajo no puede afirmar, y por qué.");
  const lim = [
    ["Las cifras absolutas son bajas", "TrashDet, con búsqueda de arquitectura dedicada, reporta 19.5 mAP50 en un subconjunto comparable. Es una característica del problema, pero limita qué tan lejos se puede llevar la conclusión.", AMBAR],
    ["Sin detectores transformer", "CO-DETR y afines lideran el benchmark in-domain de RoLID por más de 20 puntos. Quedaron fuera por la regla de presupuesto de 20 h por experimento.", AMBAR],
    ["Un dominio quedó fuera", "StreetView-Waste (cámaras de camión) no se pudo descargar: sus cuatro enlaces devuelven error 401. Escribí a los autores sin respuesta.", GRIS2],
    ["La brecha geográfica no se midió", "Los tres datasets son europeos. La pregunta original incluía el salto a Lima, y ese conjunto propio quedó pendiente.", GRIS2],
    ["La demostración es cualitativa", "Las imágenes de la demo se descargaron de internet y no tienen anotaciones: ilustran, no miden.", GRIS2],
  ];
  lim.forEach(([t, d, c], i) => {
    const y = 1.9 + i * 1.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 0.1, h: 0.8,
      fill: { color: c }, line: { color: c, width: 0 }, rectRadius: 0.03 });
    s.addText(t, { x: 0.95, y, w: 3.9, h: 0.4, fontFace: F, fontSize: 13, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 5.0, y: y + 0.02, w: 7.7, h: 0.8, fontFace: F, fontSize: 11.5,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[30:05 – 30:50]  [ANCLA]

Las limitaciones, con honestidad.

Primero: las cifras absolutas de este problema son bajas. Ya di la referencia de TrashDet. Es una característica del problema y no un error de modelado, pero limita qué tan lejos puedo llevar la conclusión.

Segundo: no incluí detectores transformer, que lideran el benchmark in-domain de RoLID por más de veinte puntos. Quedaron fuera por la regla de presupuesto de cómputo.

Tercero: un dominio quedó fuera. StreetView-Waste, el de cámaras de camión, no se pudo descargar; sus cuatro enlaces devuelven error 401 y escribí a los autores sin respuesta.

Cuarto, y este me importa: la brecha geográfica no se midió. Los tres datasets son europeos, y la pregunta original incluía el salto a Lima. Ese conjunto propio quedó pendiente.

Y quinto: la demostración que voy a hacer es cualitativa. Las imágenes se descargaron de internet y no tienen anotaciones: ilustran, no miden.`);
}
{
  const s = L("Retos superados durante el desarrollo", "Cierre · 2 de 4",
    "Los cuatro problemas que costaron más tiempo, y cómo se resolvieron.");
  const ret = [
    ["Brecha de cómputo de 300×", "Faster R-CNN era inviable en el hardware local.", "Guardián que proyecta el costo tras las primeras iteraciones y deriva al carril adecuado.", AZUL],
    ["Fallo intermitente de librería", "Un error no determinista en la GPU de Apple abortó tres entrenamientos largos, en épocas distintas cada vez.", "Migración de esos experimentos a CUDA, donde el fallo no ocurre.", AMBAR],
    ["Corrupción silenciosa", "Una evaluación terminó sin ningún error, pero producía resultados falsos: 2 748 detecciones donde el patrón sano son ~19 400.", "Detectada validando el volumen de predicciones. Regla nueva: no basta con que no haya excepciones.", ROJO],
    ["Saturación de memoria", "Procesar un lote de imágenes en la demo agotó la memoria unificada y reinició la máquina.", "Rediseño a inferencia secuencial con liberación explícita entre imágenes.", MORADO],
  ];
  ret.forEach(([t, p, sol, c], i) => {
    const y = 1.9 + i * 1.28;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 0.1, h: 1.05,
      fill: { color: c }, line: { color: c, width: 0 }, rectRadius: 0.03 });
    s.addText(t, { x: 0.95, y, w: 3.3, h: 0.4, fontFace: F, fontSize: 12.5, bold: true,
      color: INK, margin: 0 });
    s.addText(p, { x: 4.35, y: y + 0.02, w: 4.3, h: 1.0, fontFace: F, fontSize: 11,
      color: GRIS, margin: 0 });
    s.addText("→  " + sol, { x: 8.8, y: y + 0.02, w: 3.9, h: 1.0, fontFace: F, fontSize: 11,
      color: c, margin: 0 });
  });
  s.addNotes(`[30:50 – 31:35]  [ANCLA]

Los retos que más tiempo costaron.

El primero ya lo conté: la brecha de cómputo de trescientas veces, resuelta con el guardián de presupuesto.

El segundo fue un fallo intermitente de librería en la GPU de Apple, no determinista: abortó tres entrenamientos largos, cada vez en una época distinta. La solución fue migrar esos experimentos a CUDA, donde el fallo no ocurre.

El tercero es el que más me enseñó: una corrupción silenciosa. Una evaluación terminó sin ningún error, pero producía resultados falsos. La detecté porque el modelo emitió 2 748 detecciones cuando el patrón sano son unas 19 400. De ahí salió una regla nueva: no basta con que no haya excepciones; hay que validar que el volumen y la coherencia de los resultados tengan sentido.

Y el cuarto: procesar un lote de imágenes en la demo agotó la memoria unificada y reinició la máquina. Se rediseñó a inferencia secuencial con liberación explícita.`);
}
{
  const s = L("Lecciones aprendidas", "Cierre · 3 de 4");
  const lec = [
    ["Auditar antes de entrenar", "Una fuga escondida puede reescribir las conclusiones de un benchmark. Encontrarla costó días; ignorarla habría costado el trabajo completo."],
    ["Una sola vara de medición", "Es lo que vuelve comparables familias de modelos distintas — y también lo que delata un número imposible cuando algo salió mal."],
    ["Los guardianes convierten fallos en decisiones", "Presupuesto, divergencia y cuarentena transformaron noches de cómputo incierto en un registro auditable de qué pasó y por qué."],
    ["Validar resultados, no solo la ausencia de errores", "Un proceso puede terminar limpiamente y estar produciendo basura. El volumen y la coherencia de la salida son parte de la verificación."],
  ];
  lec.forEach(([t, d], i) => {
    const y = 1.9 + i * 1.28;
    s.addShape(pres.shapes.OVAL, { x: 0.62, y: y + 0.05, w: 0.58, h: 0.58,
      fill: { color: GRANATE }, line: { color: GRANATE, width: 0 } });
    s.addText(String(i + 1), { x: 0.62, y: y + 0.13, w: 0.58, h: 0.4, fontFace: F,
      fontSize: 16, bold: true, color: BG, align: "center", margin: 0 });
    s.addText(t, { x: 1.42, y, w: 11.3, h: 0.42, fontFace: F, fontSize: 15.5, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 1.42, y: y + 0.42, w: 11.3, h: 0.7, fontFace: F, fontSize: 12,
      color: GRIS, margin: 0 });
  });
  s.addNotes(`[31:35 – 32:15]  [ANCLA]

Cuatro lecciones que me llevo.

Auditar antes de entrenar. Una fuga escondida puede reescribir las conclusiones de un benchmark. Encontrarla costó días; ignorarla habría costado el trabajo completo.

Una sola vara de medición. Es lo que vuelve comparables familias de modelos distintas, y también lo que delata un número imposible cuando algo salió mal.

Los guardianes convierten fallos en decisiones. Presupuesto, divergencia y cuarentena transformaron noches de cómputo incierto en un registro auditable de qué pasó y por qué.

Y la cuarta, que ya conté: validar los resultados, no solo la ausencia de errores. Un proceso puede terminar limpiamente y estar produciendo basura.`);
}
{
  const s = L("Conclusiones y trabajo futuro", "Cierre · 4 de 4");
  const conc = [
    ["Aún no existe un modelo universal de basura", "Para una ciudad con sensores mixtos, el ajuste por dominio —o al menos la adaptación de resolución— sigue siendo obligatorio."],
    ["La higiene de los datos cambia conclusiones", "Los datasets con estructura de video deberían publicar identificadores de grupo. Los splits corregidos ya están publicados."],
    ["Detectar sin clasificar, y clasificar aparte", "El diagnóstico del error sugiere separar las dos tareas en lugar de refinar cabezas de detección cada vez más complejas."],
  ];
  conc.forEach(([t, d], i) => {
    const y = 1.9 + i * 1.28;
    card(s, 0.62, y, 12.1, 1.1, GRANATE, t, d, { bf: 12, tf: 15 });
  });
  s.addText("Trabajo futuro", { x: 0.62, y: 5.85, w: 4, h: 0.4, fontFace: F, fontSize: 14,
    bold: true, color: INK, margin: 0 });
  const fut = ["detectores transformer", "agregación temporal sobre video", "conjunto propio Lima-OOD",
               "tiling para objetos pequeños", "despliegue en el borde"];
  fut.forEach((t, i) => {
    const x = 0.62 + i * 2.46;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 6.3, w: 2.3, h: 0.55,
      fill: { color: BG_SUAVE }, line: { color: GRIS2, width: 1.2 }, rectRadius: 0.05 });
    s.addText(t, { x: x + 0.06, y: 6.4, w: 2.18, h: 0.4, fontFace: F, fontSize: 9.5,
      color: GRIS, align: "center", margin: 0 });
  });
  s.addNotes(`[32:15 – 32:55]  [ANCLA]

Tres conclusiones.

Primera: aún no existe un modelo universal de basura. Para una ciudad que despliega sensores mixtos, el ajuste por dominio —o al menos la adaptación de resolución— sigue siendo obligatorio. Y ese es, además, el punto de partida natural para el trabajo futuro que mencioné al inicio: entrenar un modelo conjunto con los tres dominios.

Segunda: la higiene de los datos cambia conclusiones. Los datasets con estructura de video deberían publicar identificadores de grupo, y los splits corregidos ya están publicados para que nadie tenga que repetir este trabajo.

Tercera: el diagnóstico del error sugiere separar detección y clasificación de material, en lugar de seguir refinando cabezas de detección cada vez más complejas.

Como trabajo futuro: transformers, agregación temporal sobre el video de dashcam, el conjunto propio de Lima, tiling para objetos pequeños y despliegue en el borde.`);
}

// ═══ 8 · DEMO ════════════════════════════════════════════════════════════════
Sec("08", "La demostración", "El sistema completo ejecutado sobre diez imágenes descargadas de internet")
  .addNotes(`[32:55 – 33:00]  [PASO]  Separador.

A partir de aquí muestro la demostración completa, ya ejecutada. Son diez imágenes que descargué de internet y que ningún modelo vio durante el entrenamiento.`);
{
  const s = L("Cómo funciona la demostración", "Demostración · el flujo",
    "Un solo comando procesa el lote completo con los cuatro modelos y guarda todo en disco.");
  const pasos = [["1", "Descargar", "imágenes de basura de internet"],
                 ["2", "Soltar", "en una carpeta del proyecto"],
                 ["3", "Ejecutar", "«Run All» en la notebook"],
                 ["4", "Recoger", "resultados y tabla resumen"]];
  pasos.forEach(([n, t, d], i) => {
    const x = 0.62 + i * 3.13;
    s.addShape(pres.shapes.OVAL, { x: x + 1.05, y: 2.0, w: 0.8, h: 0.8,
      fill: { color: GRANATE }, line: { color: GRANATE, width: 0 } });
    s.addText(n, { x: x + 1.05, y: 2.12, w: 0.8, h: 0.55, fontFace: F, fontSize: 20,
      bold: true, color: BG, align: "center", margin: 0 });
    s.addText(t, { x, y: 2.95, w: 2.9, h: 0.4, fontFace: F, fontSize: 15.5, bold: true,
      color: INK, align: "center", margin: 0 });
    s.addText(d, { x: x + 0.15, y: 3.36, w: 2.6, h: 0.6, fontFace: F, fontSize: 11.5,
      color: GRIS, align: "center", margin: 0 });
    if (i < 3) flecha(s, x + 2.95, 2.25, 0.35);
  });
  card(s, 0.62, 4.3, 3.9, 2.2, AZUL, "Qué recibe cada modelo",
    "La misma lista de imágenes, sin ningún ajuste manual. El sistema detecta la sesión más reciente y procesa todo el lote automáticamente.", { bf: 11.5 });
  card(s, 4.72, 4.3, 3.9, 2.2, VERDE, "Qué produce",
    "Un collage por modelo · una tira comparativa por imagen · gráficas de indicadores · una tabla resumen · un archivo de créditos con la autoría detectada.", { bf: 11.5 });
  card(s, 8.82, 4.3, 3.9, 2.2, GRANATE, "Por qué importa",
    "Es la prueba de reproducibilidad: cualquiera puede descargar los pesos publicados, poner sus propias fotos y obtener este mismo flujo en unos minutos.", { bf: 11.5 });
  s.addNotes(`[33:00 – 33:35]  [ANCLA]

Así funciona la demostración. Descargo imágenes, las dejo en una carpeta del proyecto, ejecuto la notebook completa y recojo los resultados.

Cada modelo recibe exactamente la misma lista de imágenes, sin ningún ajuste manual: el sistema detecta la sesión más reciente y procesa todo el lote.

Lo que produce es un collage por modelo, una tira comparativa por imagen, gráficas de indicadores, una tabla resumen y un archivo de créditos con la autoría que se pueda detectar en los metadatos.

Y por qué importa: es la prueba de reproducibilidad. Cualquiera puede descargar los pesos publicados, poner sus propias fotos y obtener este mismo flujo en unos minutos.`);
}
{
  const s = L("Las diez imágenes de entrada", "Demostración · los datos",
    "Descargadas de internet, sin anotaciones y sin relación con ninguno de los tres datasets de entrenamiento.");
  await fit(s, A("d_entrada.png"), 0.4, 1.85, 12.55, 4.35);
  s.addText([{ text: "Escenas mezcladas a propósito: ", options: { bold: true, color: INK } },
             { text: "contenedores desbordados, veredas, parques, playas y avenidas — con distintas resoluciones, ángulos y distancias. Ninguna proviene de los dominios de entrenamiento.", options: { color: GRIS } }],
    { x: 0.62, y: 6.35, w: 12.1, h: 0.5, fontFace: F, fontSize: 12.5, margin: 0 });
  pie(s, "Imágenes descargadas de internet solo con fines ilustrativos. Solo una conserva metadatos de autoría (img_01 · Ake Dynamic); las demás son descargas anónimas. Serán reemplazadas por capturas propias.");
  s.addNotes(`[33:35 – 34:20]  [ANCLA]

Estas son las diez imágenes de entrada, tal como las imprime la notebook al inicio de la sesión.

Las escogí mezcladas a propósito: contenedores desbordados, veredas, parques, playas y avenidas. Tienen resoluciones muy distintas —desde 335 por 597 hasta 2 560 por 1 920 píxeles—, ángulos distintos y distancias distintas.

Y lo importante: ninguna proviene de los dominios de entrenamiento. Son fotos de internet, sin anotaciones. Eso las hace evidencia cualitativa, no una medición.

Una nota sobre procedencia: solo una conserva metadatos de autoría —img_01, de Ake Dynamic—; las demás son descargas anónimas. Está declarado en el paper, y la intención es reemplazarlas por capturas propias más adelante.`);
}
{
  const s = L("Paso 1 · YOLOv11n sobre todo el lote", "Demostración · detección en una etapa",
    "El modelo de 2.6 M de parámetros, con umbral de confianza en 0.25.");
  await fit(s, A("d_yolo.png"), 0.4, 1.85, 12.55, 4.35);
  s.addText([{ text: "87 detecciones en total. ", options: { bold: true, color: AMBAR } },
             { text: "Rinde bien en escenas cercanas y con objetos grandes (img_05: 23 · img_03: 19), y se queda corto cuando la escena es panorámica y los objetos se vuelven diminutos.", options: { color: GRIS } }],
    { x: 0.62, y: 6.35, w: 12.1, h: 0.5, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[34:20 – 34:55]  [ANCLA]

Primer paso: YOLOv11n procesa todo el lote de una vez. Es el modelo de 2.6 millones de parámetros, con el umbral de confianza en 0.25.

En total encuentra 87 objetos. Fíjense en el patrón: rinde bien en escenas cercanas y con objetos grandes —img_05 con 23 detecciones, img_03 con 19— y se queda corto cuando la escena es panorámica y los objetos se vuelven diminutos.

El caso extremo es img_10, la playa vista de lejos: cero detecciones. Volveremos a ese caso porque es el más instructivo de toda la sesión.`);
}
{
  const s = L("Paso 2 · Faster R-CNN sobre el mismo lote", "Demostración · detección en dos etapas",
    "El modelo de 41.3 M de parámetros, con umbral de confianza en 0.5.");
  await fit(s, A("d_frcnn.png"), 0.4, 1.85, 12.55, 4.35);
  s.addText([{ text: "211 detecciones en total, más del doble que YOLO. ", options: { bold: true, color: AZUL } },
             { text: "Su red de propuestas genera muchos más candidatos: img_09 pasa de 15 a 45, e img_10 —donde YOLO no detectó nada— llega a 26.", options: { color: GRIS } }],
    { x: 0.62, y: 6.35, w: 12.1, h: 0.5, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[34:55 – 35:30]  [ANCLA]

Segundo paso: el mismo lote, ahora con Faster R-CNN. El modelo de 41.3 millones de parámetros, con umbral en 0.5.

Encuentra 211 objetos: más del doble que YOLO. La razón está en la arquitectura que expliqué antes: su red de propuestas genera muchos más candidatos antes de decidir.

Miren img_09: pasa de 15 detecciones a 45. Y img_10, donde YOLO no detectó absolutamente nada, aquí llega a 26.

Esto es el mismo patrón que mostraban las tablas cuantitativas, ahora sobre imágenes que ningún modelo vio jamás.`);
}
{
  const s = L("Paso 3 · FCN: qué superficie está cubierta", "Demostración · segmentación",
    "En vez de contar objetos, marca los píxeles que corresponden a basura.");
  await fit(s, A("d_fcn.png"), 0.4, 1.85, 12.55, 4.35);
  s.addText([{ text: "Entre 3.3 % y 16.0 % de la escena, con 8.5 % de media. ", options: { bold: true, color: ROJO } },
             { text: "Es una medida distinta y complementaria: img_05 y img_01 encabezan por superficie cubierta, aunque no sean las que más objetos individuales tienen.", options: { color: GRIS } }],
    { x: 0.62, y: 6.35, w: 12.1, h: 0.5, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[35:30 – 36:00]  [ANCLA]

Tercer paso: el FCN. En vez de contar objetos, marca los píxeles que corresponden a basura, y eso responde una pregunta distinta: cuánta superficie de la escena está cubierta.

Los valores van de 3.3 a 16 por ciento, con una media de 8.5.

Y noten algo interesante: img_05 e img_01 encabezan por superficie cubierta, aunque no son las que más objetos individuales tienen. Son dos formas distintas de medir el mismo problema, y para una municipalidad la superficie puede ser más útil que el conteo.`);
}
{
  const s = L("Paso 4 · Grad-CAM: dónde mira el clasificador", "Demostración · interpretabilidad",
    "Para cada imagen: el recorte que analiza y el mapa de calor de la decisión.");
  await fit(s, A("d_gradcam.png"), 0.35, 1.85, 12.65, 4.4);
  s.addText([{ text: "P(basura) = 1.00 en las diez imágenes, ", options: { bold: true, color: MORADO } },
             { text: "y la activación se concentra sobre el objeto y no sobre el fondo. Es la verificación de que la red aprendió lo correcto, ahora sobre datos completamente nuevos.", options: { color: GRIS } }],
    { x: 0.62, y: 6.4, w: 12.1, h: 0.5, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[36:00 – 36:35]  [ANCLA]

Cuarto paso: Grad-CAM. Para cada imagen se toma un recorte —la detección más confiada de YOLO, o el centro si no hubo ninguna— y se genera el mapa de calor de la decisión del clasificador.

El clasificador da probabilidad de basura igual a 1.00 en las diez imágenes. Y lo importante es dónde mira: la activación se concentra sobre el objeto, no sobre el pasto ni la vereda.

Esta es exactamente la verificación que planteé al inicio como justificación para incluir interpretabilidad, y aquí está funcionando sobre datos completamente nuevos.`);
}
{
  const s = L("La misma imagen, vista por los cuatro modelos", "Demostración · comparación por imagen",
    "La salida que más ayuda a entender: cada escena atravesando el sistema completo.");
  await fit(s, A("strip_respaldo1.jpg"), 0.5, 1.9, 12.35, 2.25);
  await fit(s, A("strip_respaldo2.jpg"), 0.5, 4.3, 12.35, 2.25);
  pie(s, "Columnas: original con el recorte del Grad-CAM marcado en punteado · YOLOv11n · Faster R-CNN · máscara del FCN · mapa Grad-CAM.");
  s.addNotes(`[36:35 – 37:15]  [ANCLA]

Esta es la salida que más ayuda a entender el sistema: cada escena atravesando los cuatro modelos, lado a lado.

De izquierda a derecha: el original con un recuadro punteado que marca de dónde sale el recorte del Grad-CAM; las detecciones de YOLO; las de Faster R-CNN; la máscara del FCN; y el mapa de calor.

Comparen las dos columnas de detección en cualquiera de las dos filas: Faster R-CNN llena la escena de cajas, YOLO es mucho más conservador. Ninguno de los dos está mal: son dos compromisos distintos entre precisión y recall, que es exactamente lo que expliqué en el bloque de métricas.`);
}
{
  const s = L("El caso más instructivo de la sesión", "Demostración · cuando el modelo falla",
    "img_10: una playa fotografiada de lejos. YOLO no detecta nada; Faster R-CNN encuentra 26 objetos.");
  await fit(s, A("d_caso_img10.png"), 0.5, 1.85, 12.35, 3.9);
  card(s, 0.62, 5.95, 5.95, 1.15, AMBAR, "Por qué YOLO no ve nada",
    "A 640 px de entrada, los objetos de esta escena quedan en pocos píxeles: por debajo del umbral de confianza no sobrevive ninguna caja.", { bf: 11.5, tf: 13 });
  card(s, 6.78, 5.95, 5.95, 1.15, GRANATE, "Qué ilustra",
    "Es la misma degradación por escala que midió la matriz cross-domain — visible aquí, en vivo, sobre una foto cualquiera de internet.", { bf: 11.5, tf: 13 });
  s.addNotes(`[37:15 – 37:55]  [ANCLA]

Y este es el caso más instructivo de toda la sesión, porque es un fallo.

img_10 es una playa fotografiada de lejos. YOLO no detecta absolutamente nada: cero cajas. Faster R-CNN encuentra 26 objetos.

¿Por qué? A 640 píxeles de entrada, los objetos de esta escena quedan reducidos a unos pocos píxeles cada uno. Ninguna caja sobrevive al umbral de confianza.

Y lo que ilustra es precisamente la degradación por escala que midió la matriz cross-domain: cuando el objeto se vuelve demasiado pequeño para las anclas del modelo, el detector deja de verlo. Aquí está pasando en vivo, sobre una foto cualquiera de internet.

Es también un argumento a favor de la ablación de resolución: esta escena a 1 024 píxeles daría un resultado distinto.`);
}
{
  const s = L("Los indicadores de la sesión", "Demostración · resultados agregados");
  await fit(s, A("d_indicadores.png"), 0.5, 1.8, 12.35, 4.3);
  s.addText([{ text: "Faster R-CNN propone más candidatos en las diez imágenes, sin excepción. ", options: { bold: true, color: INK } },
             { text: "Ese comportamiento coincide con lo medido en el conjunto de test anotado, lo que sugiere que no es un artefacto de estas fotos en particular.", options: { color: GRIS } }],
    { x: 0.62, y: 6.25, w: 12.1, h: 0.55, fontFace: F, fontSize: 12.5, margin: 0 });
  s.addNotes(`[37:55 – 38:30]  [ANCLA]

Los indicadores agregados de la sesión.

A la izquierda, detecciones por imagen: Faster R-CNN en azul, YOLO en ámbar. Faster R-CNN propone más candidatos en las diez imágenes, sin una sola excepción.

Ese detalle importa: el mismo comportamiento aparece en el conjunto de test anotado, donde sí puedo medir. Que se repita aquí sugiere que no es un artefacto de estas fotos en particular, sino una propiedad de las arquitecturas.

A la derecha, el porcentaje de píxeles marcados como basura por el FCN, que es la lectura de superficie.`);
}
{
  const s = L("La tabla resumen que genera la sesión", "Demostración · salida tabular");
  const cab = ["imagen", "YOLO", "Faster R-CNN", "% píxeles basura", "P(basura)"];
  const filas = [["img_01", "4", "25", "14.43", "1.00"], ["img_02", "10", "13", "6.21", "1.00"],
                 ["img_03", "19", "29", "9.21", "1.00"], ["img_04", "5", "7", "8.49", "1.00"],
                 ["img_05", "23", "28", "15.99", "1.00"], ["img_06", "6", "21", "3.37", "1.00"],
                 ["img_07", "3", "9", "5.16", "1.00"], ["img_08", "2", "8", "8.16", "1.00"],
                 ["img_09", "15", "45", "10.31", "1.00"], ["img_10", "0", "26", "3.27", "1.00"]];
  const anchos = [1.9, 1.5, 2.0, 2.2, 1.6];
  let x0 = 0.62;
  cab.forEach((c, j) => {
    s.addShape(pres.shapes.RECTANGLE, { x: x0, y: 1.85, w: anchos[j], h: 0.42,
      fill: { color: INK }, line: { color: INK, width: 0 } });
    s.addText(c, { x: x0 + 0.08, y: 1.9, w: anchos[j] - 0.16, h: 0.32, fontFace: F,
      fontSize: 11, bold: true, color: BG, align: j === 0 ? "left" : "center", margin: 0 });
    x0 += anchos[j];
  });
  filas.forEach((f, i) => {
    const y = 2.32 + i * 0.42;
    let x = 0.62;
    f.forEach((v, j) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: anchos[j], h: 0.42,
        fill: { color: i % 2 ? BG_SUAVE : BG }, line: { color: REJILLA, width: 0.8 } });
      const destaca = (j === 1 && v === "0") || (j === 2 && v === "45") || (j === 3 && v === "15.99");
      s.addText(v, { x: x + 0.08, y: y + 0.06, w: anchos[j] - 0.16, h: 0.3, fontFace: F,
        fontSize: 11, bold: destaca, color: destaca ? ROJO : (j === 0 ? INK : GRIS),
        align: j === 0 ? "left" : "center", margin: 0 });
      x += anchos[j];
    });
  });
  card(s, 9.9, 1.85, 2.85, 2.1, AMBAR, "Totales",
    "YOLO: 87 detecciones\nFaster R-CNN: 211\n\nSuperficie media cubierta: 8.5 %", { bf: 11.5, tf: 13 });
  card(s, 9.9, 4.1, 2.85, 2.4, GRIS2, "Cómo leerla",
    "Las tres celdas resaltadas son los extremos: el fallo de YOLO en img_10, la máxima densidad de Faster R-CNN en img_09 y la mayor superficie cubierta en img_05.", { bf: 11.5, tf: 13 });
  pie(s, "La tabla se exporta como summary.csv junto con las imágenes anotadas y el archivo de créditos.");
  s.addNotes(`[38:30 – 39:05]  [ANCLA]

Y esta es la tabla resumen que genera la sesión, exportada como archivo CSV junto con todas las imágenes anotadas.

Una fila por imagen, con las detecciones de cada detector, el porcentaje de superficie cubierta y la probabilidad del clasificador.

Resalté las tres celdas de los extremos: el cero de YOLO en img_10, que es el fallo que acabo de explicar; las 45 detecciones de Faster R-CNN en img_09, que es la escena más densa; y el 15.99 por ciento de superficie en img_05.

Los totales: 87 detecciones de YOLO contra 211 de Faster R-CNN, y una superficie media cubierta del 8.5 por ciento.`);
}
{
  const s = L("Qué demuestra esta sesión", "Demostración · cierre");
  const puntos = [
    ["El sistema es reproducible de punta a punta", "Cualquiera descarga los pesos publicados, deja sus fotos en una carpeta y obtiene este mismo flujo. Sin ajustes manuales ni configuración por imagen.", VERDE],
    ["Los patrones medidos reaparecen fuera de distribución", "Faster R-CNN propone más candidatos en las diez imágenes; la interpretabilidad sigue apuntando al objeto; y la degradación por escala se ve en img_10.", AZUL],
    ["Pero es evidencia cualitativa, no una medición", "Estas imágenes no tienen anotaciones: no puedo calcular AP sobre ellas. Ilustran el comportamiento; los números del trabajo salen del conjunto de test anotado.", GRANATE],
  ];
  puntos.forEach(([t, d, c], i) => {
    const y = 2.0 + i * 1.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.62, y, w: 0.12, h: 1.3,
      fill: { color: c }, line: { color: c, width: 0 }, rectRadius: 0.03 });
    s.addText(t, { x: 1.0, y, w: 11.7, h: 0.45, fontFace: F, fontSize: 16, bold: true,
      color: INK, margin: 0 });
    s.addText(d, { x: 1.0, y: y + 0.45, w: 11.7, h: 0.85, fontFace: F, fontSize: 12.5,
      color: GRIS, margin: 0 });
  });
  s.addText("El código de la demostración es la notebook 07 del repositorio; la sesión completa está publicada con sus salidas.",
    { x: 0.62, y: 6.75, w: 12.1, h: 0.4, fontFace: F, fontSize: 11.5, italic: true, color: GRIS2, margin: 0 });
  s.addNotes(`[39:05 – 39:40]  [ANCLA]

Para cerrar la demostración, tres puntos.

Primero: el sistema es reproducible de punta a punta. Cualquiera descarga los pesos publicados, deja sus fotos en una carpeta y obtiene este mismo flujo, sin ajustes manuales ni configuración por imagen.

Segundo: los patrones que medí en el conjunto de test reaparecen fuera de distribución. Faster R-CNN propone más candidatos en las diez imágenes, la interpretabilidad sigue apuntando al objeto, y la degradación por escala se ve claramente en img_10.

Y tercero, con honestidad: esto es evidencia cualitativa, no una medición. Estas imágenes no tienen anotaciones, así que no puedo calcular AP sobre ellas. Ilustran el comportamiento del sistema; los números del trabajo salen del conjunto de test anotado.`);
}
{
  const s = slideBase(true);
  logoBadge(s, 12.1, 0.5, 0.6);
  s.addText("Gracias", { x: 0.72, y: 2.3, w: 11.9, h: 1.1, fontFace: F, fontSize: 52,
    bold: true, color: BG, margin: 0 });
  s.addText("Preguntas y discusión", { x: 0.75, y: 3.5, w: 11.9, h: 0.6, fontFace: F,
    fontSize: 21, color: "BDC1C6", margin: 0 });
  s.addText([{ text: "Código, pesos, splits corregidos y datos:  ", options: { color: "9AA0A6" } },
             { text: "github.com/jairzinhosantos/how-far-does-a-litter-detector-travel", options: { color: "8AB4F8" } }],
    { x: 0.75, y: 4.65, w: 12.0, h: 0.4, fontFace: F, fontSize: 13.5, margin: 0 });
  s.addText("Jairzinho Santos  ·  Universidad Nacional de Ingeniería  ·  2026-I",
    { x: 0.75, y: 5.12, w: 11.9, h: 0.4, fontFace: F, fontSize: 11.5, color: "9AA0A6", margin: 0 });
  s.addNotes(`[35:00 – 35:30]

Eso es todo. El código, los pesos entrenados, los splits corregidos y los datos están públicos en el repositorio.

Muchas gracias, y quedo atento a sus preguntas.

[El apéndice tiene material de soporte: matriz en AP-small, rendimiento multiclase, transformers, detalle de la fuga, escala de objetos e interpretabilidad]`);
}

// ═══ APÉNDICE ════════════════════════════════════════════════════════════════
{
  const s = slideBase(true);
  logoBadge(s, 12.1, 0.5, 0.6);
  s.addText("Apéndice", { x: 0.75, y: 3.05, w: 11.9, h: 0.9, fontFace: F, fontSize: 38,
    bold: true, color: BG, margin: 0 });
  s.addText("material de soporte para preguntas", { x: 0.78, y: 4.0, w: 11.9, h: 0.5,
    fontFace: F, fontSize: 15, color: "9AA0A6", margin: 0 });
  s.addNotes("Separador del apéndice. No se muestra en la exposición: se navega solo si una pregunta lo requiere.");
}
{
  const s = L("La matriz cross-domain en AP-small", "Apéndice",
    "La misma matriz, contando solo objetos menores a 32×32 px.");
  await fit(s, A("p_matriz_aps.png"), 3.6, 1.9, 6.2, 4.7);
  pie(s, "Confirma el mecanismo: la diagonal de dashcam (0.279) y dron (0.374) sostiene el rendimiento; fuera de la diagonal el AP-small colapsa.");
  s.addNotes("Respuesta a: ¿cómo se comportan específicamente los objetos pequeños entre dominios? Es la misma matriz restringida a objetos menores de 32×32 px.");
}
{
  const s = L("Sobre el rendimiento en clasificación de materiales", "Apéndice");
  s.addText([{ text: "Las cifras absolutas del problema son estructuralmente bajas. ", options: { bold: true, color: INK } },
             { text: "TrashDet (WACV-W 2026), con búsqueda de arquitectura dedicada y 30.5 M de parámetros, reporta 19.5 mAP50 sobre un subconjunto de 5 clases de TACO. Mi variante de 5 clases da 19.2 sin búsqueda alguna.\n\n", options: { color: GRIS } },
             { text: "Y TIDE explica por qué: ", options: { bold: true, color: INK } },
             { text: "el error dominante es de clasificación (hasta 24.6 dAP), no de localización (1.7). El cuello de botella no es encontrar la basura, sino decidir de qué material está hecha — algo difícil incluso para una persona en fotos de calle.", options: { color: GRIS } }],
    { x: 0.62, y: 1.9, w: 12.1, h: 2.2, fontFace: F, fontSize: 13, margin: 0 });
  card(s, 0.62, 4.25, 12.1, 2.3, AMBAR, "La comparación 6 contra 5 clases",
    "La variante de 6 clases incluye vidrio, que solo tiene 38 instancias en test y alcanza 0.049 de AP50. Excluirlo sube el resultado global de 0.157 a 0.192, y mejora en promedio +0.014 a las cinco clases restantes: mantener una clase severamente sub-representada perjudica a las demás.", { bf: 12.5 });
  s.addNotes("Respuesta a: ¿por qué el multiclase rinde bajo? Anclar en TrashDet (19.5 contra nuestro 19.2) y en el diagnóstico TIDE: el error es de clasificación, no de detección.");
}
{
  const s = L("Sobre los detectores transformer", "Apéndice");
  s.addText([{ text: "CO-DETR y arquitecturas afines lideran el benchmark in-domain de RoLID-11K por más de 20 puntos de AP50. ", options: { bold: true, color: INK } },
             { text: "Quedaron fuera de este trabajo por dos razones:", options: { color: GRIS } }],
    { x: 0.62, y: 1.9, w: 12.1, h: 0.85, fontFace: F, fontSize: 13, margin: 0 });
  card(s, 0.62, 2.85, 5.95, 1.7, AMBAR, "Presupuesto de cómputo",
    "La regla del proyecto es 20 h por experimento. Un detector transformer sobre 11 564 imágenes excede ese presupuesto en el hardware disponible.", { bf: 12 });
  card(s, 6.78, 2.85, 5.95, 1.7, AZUL, "Objetivo del trabajo",
    "La cantidad que mido es relativa —la degradación entre dominios— y es robusta a la elección de arquitectura: un modelo mejor sube la diagonal y el resto proporcionalmente.", { bf: 12 });
  await fit(s, A("p_curvas.png"), 1.8, 4.7, 9.7, 2.2);
  pie(s, "Están declarados como la primera línea del trabajo futuro.");
  s.addNotes("Respuesta a: ¿por qué no transformers? Presupuesto de cómputo, y porque la cantidad medida es relativa y robusta a la arquitectura. Declarado en trabajo futuro.");
}
{
  const s = L("Detalle de la fuga y su corrección", "Apéndice");
  const datos = [["22 de 84", "videos reparten cuadros en más de un split oficial"],
                 ["58.2 %", "de los cuadros de test comparte video con el entrenamiento"],
                 ["87 %", "de los pares intra-video son casi duplicados"],
                 ["0 %", "de fuga en el esquema corregido, con 70/15/15 exactos"]];
  datos.forEach(([n, d], i) => {
    const x = 0.62 + i * 3.08;
    s.addText(n, { x, y: 1.95, w: 2.9, h: 0.7, fontFace: F, fontSize: 24, bold: true,
      color: i === 3 ? VERDE : ROJO, margin: 0 });
    s.addText(d, { x, y: 2.62, w: 2.9, h: 0.8, fontFace: F, fontSize: 11, color: GRIS,
      margin: 0, valign: "top" });
  });
  await fit(s, A("p_fuga.png"), 2.6, 3.6, 8.1, 3.1);
  pie(s, "Los splits corregidos se publicaron como recurso reutilizable en el repositorio del proyecto.");
  s.addNotes("Respuesta a: ¿cómo detectaste la fuga y cómo la corregiste? Cruce de video contra split, verificación con hash perceptual, y corrección publicada como recurso reutilizable.");
}
{
  const s = L("La escala del objeto, en detalle", "Apéndice");
  await fit(s, A("p_escala.png"), 2.4, 1.9, 8.5, 4.6);
  pie(s, "Distribución acumulada del lado del objeto por dominio. Casi el 80 % de los objetos de dashcam queda por debajo del ancla FPN más pequeña.");
  s.addNotes("Respuesta a: ¿cómo sustentas que la escala es la causa? Esta distribución acumulada muestra que casi el 80 % de los objetos de dashcam está por debajo del ancla mínima de 32 px.");
}
{
  const s = L("Interpretabilidad por dominio", "Apéndice");
  await fit(s, A("cam_panel_paper.png"), 3.6, 1.85, 6.2, 4.8);
  pie(s, "Una fila por dominio (dashcam, mano, dron): Grad-CAM y Guided Backpropagation concentran la activación sobre el objeto, incluso en recortes de 22 px.");
  s.addNotes("Respuesta a: ¿cómo verificas que la red no aprendió el fondo? Grad-CAM y Guided Backpropagation por dominio muestran la activación sobre el objeto.");
}

await pres.writeFile({ fileName: path.join(__dirname, "presentacion.pptx") });
console.log("presentacion.pptx generada");
})();
