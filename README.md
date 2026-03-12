# PA Acoustic - Sitio Web de Audio Profesional

![PA Acoustic](img/logo.jpg)

Sitio web oficial de **PA Acoustic**, empresa especializada en equipos de audio profesional de alta potencia ubicada en Medellín, Colombia.

---

## 📋 Historial de Cambios

| Fecha | Cambios | Archivos Afectados |
|-------|---------|-------------------|
| 11/03/2026 | Reorganizar sección contacto: mapa de Google Maps, dirección, país/ciudad y botón WhatsApp | index.html |
| 11/03/2026 | Agregar mapa de Google en sección contacto: Cl 44 #66-75, Laureles - Estadio | index.html |
| 11/03/2026 | Agregar dirección del almacén en sección contacto: Cl 44 #66-75, Laureles - Estadio | index.html |
| 11/03/2026 | Mejoras visuales del catálogo: contador de productos, indicador de categoría y paginación con diseño profesional | css/styles.css, js/main.js, ANALISIS.md |
| 10/03/2026 | Optimizar audio: cambiar preload="auto" a preload="metadata" para evitar errores de autoplay | index.html |
| 10/03/2026 | Optimizar código: eliminar función initMobileFilters() vacía (proceso redundante) | js/main.js |
| 10/03/2026 | Revisión completa del proyecto: análisis de código fuente (index.html, css/styles.css, js/main.js), verificación de políticas, documentación actualizada | README.md, ANALISIS.md |
| 10/03/2026 | Eliminar función resetZoom() sin usar del código JavaScript | js/main.js |
| 09/03/2026 | Mejorar visibilidad watermark en modal: mayor opacidad y mejor contraste en modo claro | css/styles.css |
| 09/03/2026 | Reorganización del proyecto: eliminar archivos sin uso, corregir nombres de imágenes (sheffield) | index.html, js/main.js, productos.json, fonts/, img/ |
| 09/03/2026 | Optimizar código: eliminar funciones sin usar (toggleMobileSearch, toggleMobileFilters, applyAllFilters, clearAllFilters) | js/main.js |
| 09/03/2026 | Eliminar productos.json (no está en funcionamiento - datos en main.js) | productos.json |
| 09/03/2026 | Eliminar carpeta fonts/ vacía | fonts/ |
| 09/03/2026 | Eliminar imagen sin uso hl30a-3.jpg | img/hl30a-3.jpg |
| 09/03/2026 | Corregir nombres de imágenes con errores ortográficos (pa10shefieeld → pa10sheffield) | img/, js/main.js |
| 07/03/2026 | Actualizar contador de paginación al formato "Pag. 1. 8 / 8 de 9 productos" | js/main.js |
| 07/03/2026 | Actualizar productos.json a inglés, revisar variables en inglés, actualizar documentación | productos.json, README.md, ANALISIS.md |
| 07/03/2026 | Agregar contador de productos en el catálogo | index.html, css/styles.css, js/main.js |
| 07/03/2026 | Corregir y organizar productos.json (errores de sintaxis, campos estandarizados) | productos.json |
| 07/03/2026 | Implementar sistema de cache DOM (domCache, initCache, función $()) | js/main.js |
| 07/03/2026 | Eliminar funciones sin usar: applyMobileSearch, clearMobileSearch, applyMobileFilters, clearMobileFilters | js/main.js |
| 07/03/2026 | Corregir búsqueda en menú móvil - agregar evento input para mobileMenuSearch | js/main.js |
| 07/03/2026 | Eliminar controles de catálogo móvil (botón buscar/filtrar) | index.html |
| 07/03/2026 | Navbar fixed en móvil para que quede fijo al hacer scroll | css/styles.css |
| 07/03/2026 | Limpiar código: eliminar función handleMobileCategoryChange() sin usar | js/main.js, CHECKLIST_REQUISITOS.md |
| 07/03/2026 | Revisión de políticas y scripts - Crear funciones applyAllFilters() y clearAllFilters() | js/main.js, ANALISIS.md, CHECKLIST_REQUISITOS.md |
| 07/03/2026 | Indicador de categoría activa en catálogo | index.html, css/styles.css, js/main.js, ANALISIS.md, CHECKLIST_REQUISITOS.md |
| 07/03/2026 | Agregar nuevo producto: PA Sheffield 10 | js/main.js |
| 06/03/2026 | Sistema de zoom en modal de productos (minZoom=1, maxZoom=3, wheel + pinch-to-zoom) | js/main.js |
| 06/03/2026 | Auditoría técnica completa del proyecto - Análisis de código, políticas y cumplimiento. Puntaje: 92.5/100 | ANALISIS.md |
| 06/03/2026 | Corregir sistemas de búsqueda duplicados en navbar desktop | css/styles.css |
| 06/03/2026 | Actualización checklist de requisitos | CHECKLIST_REQUISITOS.md |
| 05/03/2026 | Agregar 2 nuevos productos: PA8N-600 y PA12N-1000 | js/main.js |
| 05/03/2026 | Análisis completo del código | index.html, css/styles.css, js/main.js |
| 03/03/2026 | Corregir navegación - función handleNavClick | js/main.js |
| 01/03/2026 | Agregar focus trap al modal | js/main.js |
| 28/02/2026 | Triplicar items del carrusel | js/main.js |
| 25/02/2026 | Refactorizar SVG de WhatsApp | index.html |
| 24/02/2026 | Agregar atributos aria-label | index.html |
| 22/02/2026 | Agregar escapeHtml() para prevenir XSS | js/main.js |
| 20/02/2026 | Corregir filtrado catálogo | js/main.js |
| 19/02/2026 | Separar selectores de categoría desktop/móvil | css/styles.css |

---

## 📋 Descripción

Sitio web de comercio electrónico/catálogo para una empresa de audio profesional que incluye:

- Catálogo de productos (Line Arrays, Woofers, Parlantes Neodimio)
- Sistema de búsqueda y filtrado por categorías
- Modal de detalles de producto con especificaciones técnicas
- Sistema de zoom en imágenes de productos
- Temas claro y oscuro
- Diseño responsivo (móvil, tablet, escritorio)
- Integración con WhatsApp para cotizaciones
- Banner carrusel automático

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| HTML5 | Estructura semántica del sitio |
| CSS3 | Estilos, animaciones, temas claro/oscuro |
| JavaScript (Vanilla) | Funcionalidad interactiva |
| Google Fonts | Tipografías (Rajdhani, Nunito) |

---

## 📁 Estructura de Archivos

```
PGW/
├── index.html                   # Página principal
├── PROJECT_RULES.txt            # Políticas y reglas del proyecto
├── README.md                    # Este archivo
├── CHECKLIST_REQUISITOS.md      # Checklist de progreso
├── ANALISIS.md                  # Informe de auditoría técnica
├── package.json                 # Configuración de Node.js
├── package-lock.json            # Lock de dependencias
├── generateProducts.js          # Generador de productos
├── generateProducts_fixed.js    # Generador de productos (versión fija)
├── run_generate.bat             # Script para generar productos
├── css/
│   └── styles.css               # Todos los estilos del sitio
├── js/
│   └── main.js                  # Funcionalidad principal
├── audio/
│   └── intro.mp3                # Audio introductorio
├── data/
│   └── products.json            # Datos de productos en JSON
├── img/
│   ├── logo.jpg                 # Logo principal
│   ├── mafondo.png              # Imagen de fondo (watermark)
│   └── products/                # Imágenes de productos
│       ├── hl30a-1.png
│       ├── hl30a-2.png
│       ├── hl10a-1.png
│       ├── hl10a-2.png
│       ├── pa10n-900-1.png
│       ├── pa10n-900-2.png
│       ├── lf18x-1.png
│       ├── lf18x-2.png
│       ├── woofer18lw2420+-1.png
│       ├── woofer18lw2420+-2.png
│       ├── pa8n600-1.png
│       ├── pa8n600-2.png
│       ├── pa12n1000-1.png
│       ├── pa12n1000-2.png
│       ├── parlante 10 sheffieeld-1.png
│       ├── parlante 10 sheffieeld-2.png
│       ├── parlante 12 sheffield-1.png
│       └── parlante 12 sheffield-2.png
├── doc/
│   ├── DOCUMENTO DE REQUISITOS DEL PROYECTO WEB.docx
│   └── products/
│       ├── FICHA TECNICA PA HL 10A.docx
│       ├── FICHA TECNICA PA HL30A.docx
│       ├── FICHA TECNICA PARLANTE 10 NEODIMIO.docx
│       ├── FICHA TECNICA PARLANTE 10 SHEFIEELD.docx
│       ├── FICHA TECNICA PARLANTE 12 SHEFFIELD.docx
│       ├── FICHA TECNICA PARLANTE LF18X401+.docx
│       ├── FICHA TECNICA WOOFER 18LW2420+.docx
│       ├── FICHA TECNICA WOOFER PA8N600.pdf
│       └── FICHA TECNICA WOOFER PA12N1000.pdf
├── scripts/                     # Scripts adicionales
└── node_modules/                # Dependencias de Node.js
```

---

## 🔧 Configuración

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local o hosting con soporte para archivos estáticos

### Cómo ejecutar localmente

1. Clonar o descargar el repositorio
2. Abrir el archivo `index.html` en un navegador
3. Opcional: Usar un servidor local como Live Server en VS Code

```bash
# Con Python (si tienes Python instalado)
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server .
```

---

## 📱 Productos del Catálogo

| Producto | Categoría | Potencia | Características |
|----------|-----------|----------|------------------|
| PA HL-30A | Line Array Activo | 2200W | SPL 137dB, 2×10" Neodimio, DSP |
| PA HL-10A | Line Array Activo | 1400W | SPL 133dB, 2×8" Neodimio |
| PA10N-900 | Parlante 10" Neodimio | 1000W | Sensibilidad 99dB |
| LF18X401+ | Woofer 18" Alto Rendimiento | 3800W | Bobina 4.5", 180oz magnético |
| 18LW2420+ | Woofer 18" Ferrita | 2600W | Bobina 4", ferrita |
| PA8N-600 | Woofer 8" Neodimio | 600W | Sensibilidad 97dB, bobina 2" |
| PA12N-1000 | Woofer 12" Neodimio | 1000W | Sensibilidad 100dB, cono semi-impermeable |
| PA Sheffield 12 | Parlante 12" Ferrita | 1000W | Bobina 3" kapton |
| PA Sheffield 10 | Parlante 10" Ferrita | 800W | Bobina 3" kapton, nuevo |

---

## ⚙️ Características Técnicas del Sitio

### Tema Claro/Oscuro
- Persistencia del tema en localStorage
- Transiciones suaves entre temas
- Variables CSS para fácil mantenimiento

### Sistema de Filtrado
- Búsqueda en tiempo real
- Filtrado por categoría
- Mensaje cuando no hay resultados
- Sin filtros activos al inicio (política del proyecto)

### Sistema de Zoom en Modal
- Zoom con rueda del mouse (scroll up = zoom in, scroll down = zoom out)
- Pinch-to-zoom en dispositivos táctiles
- Límites: minZoom=1, maxZoom=3
- Zoom out bloqueado cuando está en nivel mínimo

### Responsive Design
- Desktop: > 1024px
- Tablet: 769px - 1024px
- Móvil: ≤ 768px

---

## 📝 Políticas del Proyecto

El desarrollo de este proyecto sigue reglas estrictas definidas en `PROJECT_RULES.txt`:

1. **Estado inicial**: Sin filtros activos, mostrar todos los productos
2. **Lógica de filtrado**: Solo ejecutar cuando el usuario selecciona categoría o escribe búsqueda
3. **Mensaje de sin resultados**: Solo mostrar cuando realmente no hay productos
4. **Diseño**: No modificar sin autorización expresa
5. **Comentarios**: Todo el código debe estar comentado en español

---

## 📊 Estado del Proyecto

**Progreso: 100% - PROYECTO COMPLETO**

| Categoría | Completados | Pendientes |
|-----------|-------------|------------|
| Secciones | 8           | 0          |
| Funcionalidades | 8     | 0          |
| Ajustes solicitados | 0 | 0 |

### Pendientes (POR PARTE DEL CLIENTE):
- Proporcionar 10-15 fotos para la Galería
- Proporcionar textos finales del catálogo
- Proporcionar 10 imágenes nuevas en alta resolución

---

## 📄 Licencia

© 2026 PA Acoustic - Audio Profesional Medellín - Colombia

Desarrollado por: **Juan Pablo Vélez** - Web Developer

---

## 📞 Contacto

- **WhatsApp**: +57 305 340 2732
- **Ubicación**: Medellín, Colombia
- **Horario**: Lun – Vie: 8:45 – 18:00 · Sáb: 8:45 – 15:00
