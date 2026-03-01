/**

======================================================================
PA ACOUSTIC — main.js

Este archivo contiene toda la funcionalidad JavaScript del sitio web.
Incluye:
- Gestión del tema claro/oscuro
- Datos de productos
- Renderizado del catálogo
- Búsqueda y filtros
- Modal de detalles de producto
- Banner carrusel
- Menú móvil
- Audio introductorio
- Animaciones de scroll

NOTAS DE MARCAS DE AGUA (WATERMARKS):
- Cada producto tiene una marca de agua en la propiedad 'watermark'
- Archivos configurados:
  HL-30A:     img/hl30a-2.png
  HL-10A:     img/hl10a-2.png
  PA10N-900:  img/pa10n-2.png
  LF18X401+:  img/lf18x-2.png
  18LW2420+:  img/woof18lw-2.png
- Estilos en css/styles.css:
  .prod-watermark (catálogo) y .modal-watermark (modal)
======================================================================

**/

// ========================================
// CONSTANTES GLOBALES
// ========================================

// URL base de WhatsApp para enlaces de contacto
const WP = 'https://wa.me/573053402732';

// SVG del icono de WhatsApp (para usar dentro del modal)
const WP_SVG = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// Clave para guardar el tema en localStorage
const THEME_KEY = 'paTheme';

// ========================================
// GESTIÓN DEL TEMA (CLARO/OSCURO)
// ========================================

/**
 * Aplica el tema especificado al body del documento
 * @param {string} theme - 'light' o 'dark'
 */
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
}

/**
 * Carga el tema guardado en localStorage o usa 'dark' por defecto
 */
function loadTheme() {
  // Obtener tema guardado en localStorage
  const saved = window.localStorage.getItem(THEME_KEY);
  // Validar que sea un tema válido, si no usar 'dark'
  const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
  applyTheme(theme);
}

/**
 * Alterna entre tema claro y oscuro
 * Guarda la preferencia en localStorage
 */
function toggleTheme() {
  // Obtener tema actual
  const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  // Calcular siguiente tema
  const next = current === 'light' ? 'dark' : 'light';
  // Aplicar y guardar
  applyTheme(next);
  window.localStorage.setItem(THEME_KEY, next);
}

// ========================================
// NAVEGACIÓN
// ========================================

/**
 * Maneja el clic en el logo - scroll al inicio de la página
 * @param {Event} e - Evento del clic
 */
function handleLogoClick(e) {
  e.preventDefault(); // Prevenir comportamiento por defecto del enlace
  // Scroll suave al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Quitar selección del menú
  clearNavActive();
}

/**
 * Maneja el clic en enlaces de navegación
 * Cierra el menú móvil y actualiza el enlace activo
 * @param {Event} e - Evento del clic
 * @param {string} sectionId - ID de la sección destino
 */
function handleNavClick(e, sectionId) {
  // Cerrar menú móvil si está abierto
  toggleMobileMenu();
  
  // Quitar selección activa después de un breve momento para permitir el scroll
  setTimeout(() => {
    clearNavActive();
  }, 100);
}

/**
 * Quita la clase 'active' de todos los enlaces de navegación
 */
function clearNavActive() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
}

// ========================================
// AUDIO INTRODUCTORIO
// ========================================

/**
 * Controla la reproducción del audio introductorio
 * Solo se reproduce cuando el usuario está en el inicio (sin scroll)
 * Se detiene al hacer scroll hacia otra sección
 */
function initIntroAudio() {
  const audio = document.getElementById('introAudio');
  if (!audio) return;

  let introStopped = false;
  let introStarted = false;

  // Función para detener el audio
  function stopIntro() {
    if (introStopped) return;
    introStopped = true;
    audio.pause();
    audio.currentTime = 0;
  }

  // Función para reproducir el audio
  function playAudio() {
    // Solo reproducir si está en el inicio (scrollY < 100)
    if (introStarted || introStopped || window.scrollY >= 100) return;
    
    introStarted = true;
    audio.volume = 0.7;
    audio.play()
      .catch(function (err) {
        console.log('Audio bloqueado por el navegador');
        introStarted = false;
      });
  }

  // Función que maneja el scroll
  function onScroll() {
    // Detener cuando el usuario hace scroll hacia otra sección
    if (window.scrollY >= 100 && !introStopped) {
      stopIntro();
    }
    // Intentar reproducir si vuelve al inicio
    if (window.scrollY < 100 && !introStarted && !introStopped) {
      playAudio();
    }
  }

  // Escuchar scroll para detener/reanudar audio
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Intentar reproducir al cargar si está en el inicio
  playAudio();

  // Si el navegador bloquea el autoplay, intentar en el primer clic del usuario
  document.addEventListener('click', function firstInteraction() {
    if (window.scrollY < 100) {
      playAudio();
    }
    document.removeEventListener('click', firstInteraction);
  }, { once: true });
}

// ========================================
// DATOS DE PRODUCTOS
// ========================================

/**
 * Array de objetos con los datos de cada producto
 * Para agregar un producto: copiar un objeto, cambiar los datos e imágenes
 * 
 * Estructura de cada producto:
 * - id: Identificador único
 * - nombre: Nombre del producto
 * - cat: Categoría
 * - badge: Etiqueta visual (Top, Nuevo, Pro)
 * - desc: Descripción corta
 * - imgs: Array de rutas de imágenes
 * - watermark: Ruta de la imagen de marca de agua
 * - specs: Array de arrays [clave, valor] para especificaciones técnicas
 * - apps: Array de aplicaciones/usos del producto
 * - tags: Array de etiquetas para mostrar en la tarjeta
 */
const productos = [
  {
    id: 'hl30a',
    nombre: 'PA HL-30A',
    cat: 'Line Array Activo',
    badge: 'Top',
    desc: 'Sistema line array activo bi-amplificado de 2 vías. 2200W totales, 1100W RMS, SPL 137dB, rango 50Hz–20kHz. DSP 32 bits integrado.',
    imgs: ['img/hl30a-1.png'],
    watermark: 'img/hl30a-2.png',
    specs: [
      ['Modelo',       'PA HL-30A'],
      ['Tipo',         'Módulo activo 2 vías, biamplificado'],
      ['Amplificador', 'Clase D · DSP NET WORK'],
      ['Potencia total','2200 W'],
      ['Potencia RMS', '1100 W'],
      ['Potencia LF',  '1600 W PGM / 800 W RMS'],
      ['Potencia HF',  '600 W PGM / 300 W RMS'],
      ['Frecuencia',   '50 Hz – 20 kHz'],
      ['SPL máximo',   '137 dB'],
      ['Impedancia',   '4 ohms'],
      ['Cobertura H',  '100°'],
      ['Cobertura V',  '15°'],
      ['Woofer',       '2 × 10″ Neodymium (bob. 65.5mm)'],
      ['Driver',       '1.4mm Neodymium · Titanio · Bob. 4"'],
      ['Entrada',      'XLR'],
      ['Salida link',  'Powercom'],
      ['Material',     'Polipropileno'],
      ['Rigging',      'Sistema integrado con ajustes de ángulo'],
      ['Dimensiones',  '294 × 707 × 508 mm'],
    ],
    apps: ['Conciertos en vivo','Teatros y auditorios','Espacios medianos y grandes','Instalaciones fijas','Espectáculos móviles','Iglesias y colegios','Eventos corporativos'],
    tags: ['2200 W', '137 dB', '2×10"', 'Clase D DSP']
  },
  {
    id: 'hl10a',
    nombre: 'PA HL-10A',
    cat: 'Line Array Activo',
    badge: 'Nuevo',
    desc: 'Sistema line array activo bi-amplificado de 2 vías para formato pequeño y mediano. 1400W pico, 700W RMS, SPL 133dB.',
    imgs: ['img/hl10a-1.jpg'],
    watermark: 'img/hl10a-2.png',
    specs: [
      ['Modelo',       'PA HL-10A'],
      ['Tipo',         'Módulo activo 2 vías, biamplificado'],
      ['Potencia pico','1400 W'],
      ['Potencia RMS', '700 W'],
      ['Potencia LF',  '1000 W pico / 500 W RMS'],
      ['Potencia HF',  '400 W pico / 200 W RMS'],
      ['Frecuencia',   '65 Hz – 20 kHz'],
      ['SPL máximo',   '133 dB'],
      ['Cobertura H',  '100°'],
      ['Cobertura V',  '15°'],
      ['Transductores','2×8" Neodymium + Driver 2.5"'],
      ['Entrada',      'XLR / TRS combo'],
      ['Salida link',  'XLR'],
      ['Crossover',    '800 Hz'],
      ['Alimentación', 'powerCON IN/OUT'],
      ['Material',     'Polipropileno'],
      ['Rigging',      'Ángulos cada 2°'],
      ['Dimensiones',  '294 × 569 × 434 mm'],
      ['Peso',         '20.4 kg'],
    ],
    apps: ['Conciertos en vivo','Iglesias y colegios','Teatros y auditorios','Eventos corporativos','Conciertos al aire libre','Clubes y DJ','Centros de convenciones'],
    tags: ['1400 W', '133 dB', '2×8"', 'Clase D']
  },
  {
    id: 'pa10n',
    nombre: 'PA10N-900',
    cat: 'Parlante 10" Neodimio',
    badge: 'Pro',
    desc: 'Altavoz profesional de 10 pulgadas para Line Array, cajas turbo y car audio. 1000W programados, 500W RMS, sensibilidad 99dB.',
    imgs: ['img/pa10n-1.jpg'],
    watermark: 'img/pa10n-2.png',
    specs: [
      ['Modelo',             'PA10N-900'],
      ['Diámetro',           '255mm (10 pulgadas)'],
      ['Impedancia',         '8 ohmios'],
      ['Potencia Programada','1000 W'],
      ['Potencia RMS',       '500 W'],
      ['Sensibilidad',       '99 dB'],
      ['Frecuencia',        '50 Hz – 3500 Hz'],
      ['Bobina',            '3 pulgadas'],
      ['Capas',             '2 capas (IN - OUT)'],
    ],
    apps: ['Sistemas line array','Monitores de escenario','Cajas turbo','Sistema pickup','Car audio','Proyectos ligereza + potencia'],
    tags: ['1000 W', '99 dB', '10"', 'Neodimio']
  },
  {
    id: 'lf18x',
    nombre: 'LF18X401+',
    cat: 'Woofer 18" Alto Rendimiento',
    badge: 'Pro',
    desc: 'Woofer profesional de 18". 1900W RMS, 3800W programados, carga magnética 180oz, bobina 4.5", rango 30Hz–1000Hz.',
    imgs: ['img/lf18x-1.png'],
    watermark: 'img/lf18x-2.png',
    specs: [
      ['Modelo',             'LF18X401+'],
      ['Diámetro',           '18 pulgadas (457 mm)'],
      ['Carga magnética',    '180 onzas'],
      ['Impedancia',         '8 ohmios'],
      ['Potencia Programada','3800 W'],
      ['Potencia RMS',       '1900 W'],
      ['Sensibilidad',       '98 dB'],
      ['Frecuencia',         '30 Hz – 1000 Hz'],
      ['Excursión máx.',     '54 mm (2.13 pulgadas)'],
      ['Bobina',             '4.5 pulgadas (114 mm)'],
      ['Material bobina',    'Til / Alambre Cobre'],
      ['Capas',              '2 (Inside/Outside)'],
      ['Cono',               'Cartón prensado con fibra de vidrio'],
      ['Diámetro total',     '465 mm'],
      ['Altura total',       '212 mm'],
    ],
    apps: ['Subwoofers de alta potencia','Sistemas de sonido profesional','Cajas bass réflex','Conciertos en vivo','Teatros y auditorios','Clubes nocturnos'],
    tags: ['3800 W', '98 dB', '18"', '180oz']
  },
  {
    id: 'woof18lw',
    nombre: '18LW2420+',
    cat: 'Woofer 18" Ferrita',
    badge: 'Pro',
    desc: 'Woofer profesional de 18" con imán de ferrita. 1300W RMS, 2600W programados, bobina 4", rango 30Hz–2500Hz.',
    imgs: ['img/woof18lw-1.png'],
    watermark: 'img/woof18lw-2.png',
    specs: [
      ['Modelo',             '18LW2420+'],
      ['Diámetro',           '18 pulgadas (457 mm)'],
      ['Impedancia',         '8 ohmios'],
      ['Potencia Programada','2600 W'],
      ['Potencia RMS',       '1300 W'],
      ['Sensibilidad',       '98 dB'],
      ['Frecuencia',         '30 Hz – 2500 Hz'],
      ['Bobina',             '4 pulgadas'],
      ['Material bobina',    'Til / Alambre Cobre'],
      ['Capas',              '2 (Inside/Outside)'],
      ['Imán',               'Ferrita compacto'],
      ['Ventilación',        'Sistema posterior'],
      ['Chasis',             'Antimonio'],
    ],
    apps: ['Subwoofers de alta potencia','Sistemas de sonido profesional','Cajas bass réflex','Conciertos en vivo','Teatros y auditorios','Clubes nocturnos'],
    tags: ['2600 W', '98 dB', '18"', 'Ferrita']
  }
];

// ========================================
// BANNER CARRUSEL
// ========================================

/**
 * Maneja el clic en un item del banner
 * Hace scroll a productos y abre el modal del producto
 * @param {string} id - ID del producto
 */
function onBannerItemClick(id) {
  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => abrirModal(id), 450);
}

/**
 * Renderiza el banner carrusel con las imágenes de productos
 * Duplica los items para crear efecto infinito
 */
function renderBanner() {
  const track = document.getElementById('bannerTrack');
  if (!track) return;

  // Obtener todas las imágenes de productos
  const items = productos.flatMap(p => p.imgs.map(src => ({ src, alt: p.nombre, id: p.id })));
  // Duplicar para efecto de scroll infinito
  const duplicated = [...items, ...items];

  track.innerHTML = duplicated.map(({ src, alt, id }) => `
    <div class="banner-item" onclick="onBannerItemClick('${id}')" role="button" tabindex="0">
      <img src="${src}" alt="${alt}" />
    </div>
  `).join('');
}

// ========================================
// FILTRO Y BÚSQUEDA DEL CATÁLOGO
// ========================================

/**
 * Obtiene el texto de búsqueda de un producto
 * Combina nombre, categoría, descripción, tags y aplicaciones
 * @param {Object} p - Objeto del producto
 * @returns {string} Texto normalizado para búsqueda
 */
function getProductSearchText(p) {
  const parts = [p.nombre, p.cat, p.desc, (p.tags || []).join(' '), (p.apps || []).join(' ')];
  return parts.join(' ').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Filtra los productos según búsqueda y categoría seleccionados
 * @returns {Array} Array de productos filtrados
 */
function getFilteredProductos() {
  const searchEl = document.getElementById('catalogSearch');
  const categoryEl = document.getElementById('catalogCategory');
  // Obtener valor de búsqueda y normalizar (quitar tildes)
  const query = (searchEl && searchEl.value) ? searchEl.value.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') : '';
  // Obtener categoría seleccionada
  const category = (categoryEl && categoryEl.value) ? categoryEl.value : '';

  let list = productos;
  // Filtrar por categoría si hay una seleccionada
  if (category) list = list.filter(p => (p.cat || '') === category);
  // Filtrar por búsqueda si hay texto
  if (query) list = list.filter(p => getProductSearchText(p).includes(query));
  return list;
}

/**
 * Obtiene las categorías únicas de los productos
 * @returns {Array} Array de nombres de categorías ordenados
 */
function getUniqueCategories() {
  const set = new Set();
  productos.forEach(p => { if (p.cat) set.add(p.cat); });
  return Array.from(set).sort();
}

/**
 * Llena el selector de categorías con las opciones disponibles
 */
function fillCategorySelect() {
  const sel = document.getElementById('catalogCategory');
  if (!sel) return;
  // Guardar valor actual para no perder selección
  const current = sel.value;
  const categories = getUniqueCategories();
  // Generar opciones HTML
  sel.innerHTML = '<option value="">Todas las categorías</option>' +
    categories.map(c => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join('');
  // Restaurar valor si sigue siendo válido
  if (categories.includes(current)) sel.value = current;
}

/**
 * Escapa caracteres HTML en texto para mostrar de forma segura
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/**
 * Escapa caracteres para atributos HTML
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado para atributos
 */
function escapeAttr(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
}

/**
 * Renderiza las tarjetas de productos en el grid
 * Agrupa por categoría y aplica animaciones
 */
function renderProductos() {
  const filtered = getFilteredProductos();
  const grid = document.getElementById('productosGrid');
  if (!grid) return;

  // Mostrar mensaje si no hay resultados
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty" style="grid-column:1/-1;text-align:center;padding:3rem 2rem;background:var(--bg3);border:1px solid var(--borde);border-radius:12px;">
        <p style="font-size:1rem;color:var(--texto);margin-bottom:.5rem;">No hay productos con los filtros seleccionados.</p>
        <p style="font-size:.85rem;color:var(--muted);">Cambia la categoría o el texto de búsqueda.</p>
      </div>
    `;
    return;
  }

  // Agrupar productos por categoría
  const grouped = {};
  filtered.forEach(p => {
    if (!grouped[p.cat]) grouped[p.cat] = [];
    grouped[p.cat].push(p);
  });

  let html = '';
  let delay = 0;
  const categories = Object.keys(grouped);
  
  categories.forEach((cat, catIndex) => {
    // Añadir encabezado de categoría (oculto en CSS)
    if (catIndex > 0) {
      html += `<div class="prod-category-header"><span>${cat}</span></div>`;
    }
    
    grouped[cat].forEach((p) => {
      html += `
        <div class="prod-card" style="opacity:0;animation:fadeUp .6s ease forwards ${delay * 0.07}s" onclick="abrirModal('${p.id}')">
          <div class="prod-img-wrap">
            <img src="${p.imgs[0]}" alt="${p.nombre}"/>
            ${p.watermark ? `<img src="${p.watermark}" alt="" class="prod-watermark"/>` : ''}
            <span class="prod-badge">${p.badge}</span>
          </div>
          <div class="prod-body">
            <div class="prod-cat">${p.cat}</div>
            <div class="prod-nombre">${p.nombre}</div>
            <div class="prod-desc">${p.desc}</div>
            <div class="prod-specs">${p.tags.map(t => `<span class="spec-tag">${t}</span>`).join('')}</div>
            <div class="prod-footer">
              <span style="font-size:0.65rem;color:var(--muted)">Click para ver ficha</span>
              <button class="prod-btn">Ver más →</button>
            </div>
          </div>
        </div>
      `;
      delay++;
    });
  });

  grid.innerHTML = html;
}

/**
 * Configura los eventos de los filtros de búsqueda y categoría
 */
function setupCatalogFilters() {
  // Llenar selector de categorías
  fillCategorySelect();
  
  const searchEl = document.getElementById('catalogSearch');
  const categoryEl = document.getElementById('catalogCategory');
  const searchBox = document.getElementById('navSearchBox');
  const searchTrigger = document.getElementById('navSearchTrigger');

  // Eventos de input y change para filtros
  if (searchEl) searchEl.addEventListener('input', renderProductos);
  if (categoryEl) categoryEl.addEventListener('change', renderProductos);

  // Configurar expansión del cuadro de búsqueda
  if (searchBox && searchTrigger && searchEl) {
    searchTrigger.addEventListener('click', () => {
      const isExpanded = searchBox.classList.toggle('expanded');
      searchTrigger.setAttribute('aria-expanded', isExpanded);
      if (isExpanded) {
        searchEl.focus();
      }
    });
    // Contraer al perder foco
    searchEl.addEventListener('blur', () => {
      setTimeout(() => {
        searchBox.classList.remove('expanded');
        searchTrigger.setAttribute('aria-expanded', 'false');
      }, 180);
    });
    // Cerrar con Escape
    searchEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchEl.blur();
        searchBox.classList.remove('expanded');
        searchTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ========================================
// MODAL DE DETALLES DE PRODUCTO
// ========================================

/**
 * Abre el modal con los detalles de un producto
 * @param {string} id - ID del producto a mostrar
 */
function abrirModal(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;

  const mb = document.getElementById('modalBody');
  // Eliminar marca de agua anterior si existe
  const oldWm = mb.querySelector('.modal-watermark');
  if (oldWm) oldWm.remove();
  // Añadir nueva marca de agua si existe
  if(p.watermark) {
    const wm = document.createElement('img');
    wm.src = p.watermark;
    wm.className = 'modal-watermark';
    mb.appendChild(wm);
  }

  // Actualizar título e imagen principal
  document.getElementById('modalTitulo').textContent = p.nombre;
  document.getElementById('modalImgMain').src = p.imgs[0];

  // Generar miniaturas
  document.getElementById('modalThumbs').innerHTML = p.imgs.map((img, i) => `
    <div class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="cambiarImg('${img}', this)">
      <img src="${img}" alt=""/>
    </div>
  `).join('');

  // Generar contenido del modal (badge, specs, apps, botón WhatsApp)
  document.getElementById('modalInfo').innerHTML = `
    <span class="modal-badge">${p.badge}</span>
    <div class="modal-cat">${p.cat}</div>
    <div class="modal-nombre">${p.nombre}</div>
    <div class="modal-desc">${p.desc}</div>
    <table class="modal-tabla">
      ${p.specs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
    </table>
    <div class="modal-apps">
      <h4>Aplicaciones</h4>
      <ul>${p.apps.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>
    <a href="${WP}?text=${encodeURIComponent('Hola, me interesa el ' + p.nombre + '. ¿Pueden darme información y precio?')}"
       target="_blank" class="modal-wp">
      ${WP_SVG} Consultar por WhatsApp
    </a>
  `;

  // Abrir modal
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevenir scroll
}

/**
 * Cambia la imagen principal del modal al hacer clic en miniatura
 * @param {string} src - Ruta de la nueva imagen
 * @param {HTMLElement} el - Elemento de la miniatura
 */
function cambiarImg(src, el) {
  document.getElementById('modalImgMain').src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/**
 * Cierra el modal al hacer clic fuera del contenido
 * @param {Event} e - Evento del clic
 */
function cerrModal(e) {
  if (e.target === document.getElementById('modalOverlay')) cerrarModalBtn();
}

/**
 * Cierra el modal y restaura el scroll
 */
function cerrarModalBtn() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModalBtn(); });

// ========================================
// ANIMACIONES DE SCROLL (REVEAL)
// ========================================

/**
 * IntersectionObserver para animaciones de reveal al hacer scroll
 * Añade clase 'visible' cuando los elementos entran en viewport
 */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ========================================
// MENÚ MÓVIL
// ========================================

/**
 * Alterna la apertura/cierre del menú móvil
 */
function toggleMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navMobileOverlay');
  
  if (!hamburger || !navLinks) return;
  
  const isOpen = hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  
  if (overlay) {
    overlay.classList.toggle('open');
  }
  
  hamburger.setAttribute('aria-expanded', isOpen);
}

// ========================================
// ENLACE ACTIVO EN NAVEGACIÓN
// ========================================

/**
 * Actualiza el enlace activo en la navegación según el scroll
 */
function initActiveMenuLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  function updateActiveLink() {
    const scrollPos = window.scrollY + 150;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
    
    // Si está en el inicio (hero), quitar selección activa
    if (scrollPos < heroHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      return;
    }
    
    // Actualizar según la sección visible
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

// Ejecutar funciones al cargar el DOM
loadTheme();                  // Cargar tema guardado
initIntroAudio();           // Inicializar audio
renderBanner();              // Renderizar banner
renderProductos();           // Renderizar catálogo
setupCatalogFilters();       // Configurar filtros
initActiveMenuLink();       // Activar enlace de menú
