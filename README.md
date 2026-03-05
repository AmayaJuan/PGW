# PA Acoustic - Sitio Web de Audio Profesional

![PA Acoustic](img/logo.jpg)

Sitio web oficial de **PA Acoustic**, empresa especializada en equipos de audio profesional de alta potencia ubicada en Medellín, Colombia.

---

## 📋 Historial de Cambios

| Fecha | Cambios | Archivos Afectados |
|-------|---------|-------------------|
| 04/04/2026 | Triplicar items del carrusel en renderBanner() - evitar salto visible del loop en pantallas anchas | js/main.js |
| 14/03/2026 | Refactorizar SVG de WhatsApp - definir símbolo reutilizable una sola vez y usar <use> en los 5 enlaces | index.html |
| 08/03/2026 | Agregar atributos aria-label y aria-labelledby en nav y sections - mejorar accesibilidad para lectores de pantalla | index.html |
| 11/03/2026 | Agregar variables de sombra para tema oscuro en :root - evitan que sombras fallen en modo oscuro | css/styles.css |
| 06/03/2026 | Agregar escapeHtml() en renderProductos() - prevenir XSS en badge, cat, nombre y desc del catálogo | js/main.js |
| 06/03/2026 | Mover IntersectionObserver dentro de DOMContentLoaded - evitar errores al cargar antes del DOM | js/main.js |
| 06/03/2026 | Agregar DOCTYPE html al inicio del archivo | index.html |
| 05/03/2026 | Agregar estilo :active para enlaces del menú - corrige color oscuro al presionar en móvil | css/styles.css |
| 04/03/2026 | Corregir filtrado catálogo - mensaje "sin resultados" solo cuando hay filtros activos Y no hay productos | js/main.js |
| 04/03/2026 | Corregir navbar sticky en móvil - agregar z-index 250 para superposición correcta | css/styles.css |
| 05/03/2026 | Corregir navbar sticky en móvil/tablet - agregar position:sticky explícito en media query móvil | css/styles.css |
| 03/03/2026 | Separar selectores de categoría desktop/móvil - nunca se ven ambos al mismo tiempo | css/styles.css |
| 03/03/2026 | Corregir navbar sticky que no seguía al hacer scroll - cambiar overflow body de hidden a clip | css/styles.css |
| 03/03/2026 | Corregir menú hamburguesa no mostraba contenido - agregar estilos display:block | css/styles.css |
| 03/03/2026 | Agregar botón WhatsApp dentro del menú hamburguesa en móviles | index.html, css/styles.css |
| 03/03/2026 | Ocultar botón WhatsApp navbar en móvil portrait - permite ver menú hamburguesa | css/styles.css |
| 03/03/2026 | Corrección overflow navbar en tablet - elementos no se desbordan | css/styles.css |
| 03/03/2026 | Agregada política de actualización del README en PROJECT_RULES.txt | PROJECT_RULES.txt |
| 03/03/2026 | Corrección bug variable WP undefined en modal + creación inicial README | js/main.js, README.md |

---

## 📋 Descripción

Sitio web de comercio electrónico/catálogo para una empresa de audio profesional que incluye:

- Catálogo de productos (Line Arrays, Woofers, Parlantes Neodimio)
- Sistema de búsqueda y filtrado por categorías
- Modal de detalles de producto con especificaciones técnicas
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
├── index.html              # Página principal
├── PROJECT_RULES.txt       # Políticas y reglas del proyecto
├── README.md               # Este archivo
├── css/
│   └── styles.css          # Todos los estilos del sitio
├── js/
│   ├── main.js             # Funcionalidad principal
│   └── navbar-fix.js       # Fix dinámico del navbar
├── audio/
│   └── intro.mp3           # Audio introductorio
├── img/
│   ├── logo.jpg            # Logo principal
│   ├── mafondo.png         # Imagen de fondo (watermark)
│   ├── hl30a-1.png         # Imagen producto HL-30A
│   ├── hl30a-2.png         # Marca de agua HL-30A
│   ├── hl10a-1.png        # Imagen producto HL-10A
│   ├── hl10a-2.png        # Marca de agua HL-10A
│   ├── pa10n-1.png        # Imagen producto PA10N-900
│   ├── pa10n-2.png        # Marca de agua PA10N-900
│   ├── lf18x-1.png        # Imagen producto LF18X401+
│   ├── lf18x-2.png        # Marca de agua LF18X401+
│   ├── woof18lw-1.png     # Imagen producto 18LW2420+
│   └── woof18lw-2.png     # Marca de agua 18LW2420+
└── doc/
    ├── FICHA TECNICA PA HL 10A.docx
    ├── FICHA TECNICA PA HL30A.docx
    ├── FICHA TECNICA PARLANTE 10 NEODIMIO.docx
    ├── FICHA TECNICA PARLANTE 10 SHEFIEELD.docx
    ├── FICHA TECNICA PARLANTE 12 SHEFFIELD.docx
    ├── FICHA TECNICA PARLANTE LF18X401+.docx
    └── FICHA TECNICA WOOFER 18LW2420+.docx
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
| PA HL-30A | Line Array Activo | 2200W | SPL 137dB, 2×10" Neodimio |
| PA HL-10A | Line Array Activo | 1400W | SPL 133dB, 2×8" Neodimio |
| PA10N-900 | Parlante 10" Neodimio | 1000W | Sensibilidad 99dB |
| LF18X401+ | Woofer 18" Alto Rendimiento | 3800W | Bobina 4.5", 180oz magnético |
| 18LW2420+ | Woofer 18" Ferrita | 2600W | Bobina 4", ferrita |

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

## 📄 Licencia

© 2026 PA Acoustic - Audio Profesional Medellín - Colombia

Desarrollado por: **Juan Pablo Vélez** - Web Developer

---

## 📞 Contacto

- **WhatsApp**: +57 305 340 2732
- **Ubicación**: Medellín, Colombia
- **Horario**: Lun – Vie: 8:45 – 18:00 · Sáb: 8:45 – 15:00

