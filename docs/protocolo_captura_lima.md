# Protocolo de captura - Lima-OOD

Conjunto de prueba *out-of-distribution* propio: residuos urbanos en calles de Lima.
Sirve para medir la **brecha de dominio Europa → Perú**, que es la contribución original del proyecto.

**Equipo:** iPhone 17 Pro Max · **Meta:** 100-150 fotos · **Mínimo útil: 80.**

> Menos fotos no invalida nada. Con 80 imágenes ya se puede reportar una brecha de dominio
> con intervalos de confianza por bootstrap. **Prioriza diversidad sobre cantidad.**

---

## 1 · Configuración de la cámara (hacer una sola vez, antes de salir)

### Ajustes → Cámara

| Ajuste | Valor | Por qué |
|---|---|---|
| **Formatos → Captura de fotos** | **Más compatible (JPEG)** | HEIC obliga a un paso de conversión y algunas librerías de CV lo leen mal |
| **Formatos → Modo de foto** | **24 MP** (no 48 MP) | Todo se reescala a 640-1280 px para entrenar. 48 MP cuadruplica el peso sin ganancia |
| **Formatos → Apple ProRAW** | **OFF** | ~75 MB por foto, cero beneficio aquí |
| **Formatos → Fotos en vivo** | **OFF** | Genera un `.MOV` emparejado por foto y ensucia la ingesta |
| **Corrección de lente** | **ON** | Reduce distorsión de barril |
| **Control de macro** | **ON** | Permite **desactivar** el macro automático (ver abajo) |
| **Cuadrícula** | **ON** | Ayuda a mantener el encuadre consistente |
| **Ver fuera del encuadre** | OFF | Distrae |

### Ajustes → Privacidad → Localización → Cámara

**"Al usar la app" + Ubicación precisa ON.**

El geotag EXIF es valioso: permite agrupar fotos por ubicación para el *split group-aware*
(evita que la misma cuadra caiga en train y test) y documentar diversidad espacial en el paper.

> Antes de publicar el dataset, el GPS se redondea a ~3 decimales o se elimina. Eso se hace en el notebook de curación, no ahora.

### Durante la captura

| | |
|---|---|
| **Lente** | Quedarse en **1×**. Unas pocas a 2× para variar escala. **Nunca 0.5×** (distorsión ultra gran angular) |
| **Macro automático** | **Desactivarlo** cuando aparezca el ícono de flor. Al activarse cambia a la lente ultra gran angular y cambian los parámetros intrínsecos a media sesión |
| **Modo Retrato** | **Nunca.** El bokeh sintético destruye la textura de los objetos pequeños |
| **Modo Noche** | Evitar. Fusiona múltiples tomas y genera artefactos de movimiento. Preferir luz de día |
| **Flash** | OFF |
| **Zoom digital** | No pasar de 2× |
| **Ráfaga** | No usar |

---

## 2 · Guion de captura

### Mezcla de distancias - *lo más importante del protocolo*

| Proporción | Distancia | Cómo se ve | Para qué |
|---|---|---|---|
| **~40 %** | **3–8 m** (lejos) | El residuo ocupa una fracción pequeña del encuadre | Régimen *small object*, comparable con el dominio dashcam |
| **~40 %** | **1–3 m** (medio) | Residuo claramente visible, con contexto de calle | Coincide con la distribución dominante de TACO |
| **~20 %** | **0.3–1 m** (cerca) | Objeto individual, material identificable | Positivos fáciles; habilita el experimento multi-clase |

Si se sacrifica algo, que sea la categoría "cerca". **La de "lejos" es la que aporta más valor científico** y es la que uno tiende a no tomar por instinto.

### Altura y ángulo

- Cámara a la **altura del pecho o de los ojos** (1.4-1.7 m).
- Inclinada hacia abajo **entre 30° y 60°**.
- **No cenital** (eso es el dominio del dron, ya cubierto por UAVVaste).
- **No horizontal puro** (el suelo casi no aparece).

### Ejes de diversidad - variar deliberadamente

| Eje | Variantes a cubrir |
|---|---|
| **Superficie** | Asfalto · vereda · tierra · pasto · canaleta · junto a contenedor · escalera |
| **Iluminación** | Mañana · mediodía (sombras duras) · tarde · sol directo · sombra · día nublado |
| **Densidad** | Objeto aislado · 2–5 objetos dispersos · acumulación / montículo |
| **Material** | Plástico (botella, bolsa, envoltorio) · papel/cartón · metal (lata) · vidrio · orgánico · **colillas** |
| **Zona** | Al menos **3 barrios o zonas distintas** sin esto el split por ubicación no funciona |

> Las **colillas** son el caso más difícil y el más citado en la literatura. Vale la pena buscarlas a propósito.

### Negativos - **no omitir**

**10–15 % de las fotos (≈ 15-20) deben ser escenas de calle limpias, sin ningún residuo.**

Se olvida casi siempre y es imprescindible: sin negativos no se pueden medir falsos positivos
y la tasa de FP es justamente donde los modelos de basura fallan más. Mismos encuadres, mismas
superficies, misma iluminación pero sin basura.

### Qué NO hacer

| Evitar | Por qué |
|---|---|
| 5 fotos casi idénticas de la misma escena | Fuga entre train y test. Si tomas 2-3 de una escena, muévete y cambia el ángulo notoriamente |
| Poner o mover la basura para que se vea mejor | Deja de ser *in the wild*, que es todo el punto |
| Rostros identificables o placas de vehículos | Problema de privacidad al publicar. Reencuadrar o evitar |
| Solo la zona más sucia de un solo barrio | Sin diversidad espacial no hay split válido |
| Todo en la misma hora del día | La iluminación es un factor de dominio importante |

---

## 3 · Después de la salida

### Transferencia

**Cable + Captura de Imagen** (Image Capture) es lo más seguro, o AirDrop.

**Atención:** si usas Fotos de iCloud con "Optimizar almacenamiento", verifica en
**Ajustes → Fotos → Descargar y conservar originales**, o transferirás versiones reducidas.

Destino:

```
code/data/raw/lima_ood/
```

**No renombres los archivos.** Conserva `IMG_####.JPG`: el orden y el EXIF (timestamp + GPS)
permiten reconstruir automáticamente los grupos de escena por *clustering* espacio-temporal.
No hace falta llevar bitácora en campo.

### Volumen esperado

24 MP JPEG ≈ 3-5 MB por foto → **150 fotos ≈ 600 MB.** Irrelevante frente a los 214 GB libres.

### Anotación (fase posterior)

- **Roboflow** (plan gratuito), **CVAT** o **LabelMe** → exportar en **formato COCO**.
- Empezar con **1 clase (`litter`)**, que es lo que permite comparar contra los 3 dominios.
- Si alcanza el tiempo, una segunda pasada con las super-clases por material.
- Regla de anotación: **cualquier residuo visible e inequívoco**, por pequeño que sea.
  Si hay duda razonable sobre si es basura o no, no se anota (y se anota mentalmente como caso ambiguo para la discusión del paper).

---

## 4 · Lista de verificación antes de salir

- [ ] Formatos → Más compatible (JPEG), 24 MP, ProRAW OFF, Fotos en vivo OFF
- [ ] Control de macro ON · Cuadrícula ON · Corrección de lente ON
- [ ] Localización precisa activada para Cámara
- [ ] Batería cargada · al menos 5 GB libres en el iPhone
- [ ] Ruta mental con **3+ zonas distintas**
- [ ] Recordar: **40 % lejos · 40 % medio · 20 % cerca · 15 % sin basura**
