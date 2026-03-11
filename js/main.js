/**
======================================================================
PA ACOUSTIC — main.js

REGLAS CRÍTICAS DEL PROYECTO (OBLIGATORIO LEER):
-------------------------------------------------
1. ESTADO INICIAL: Sin filtros activos, mostrar TODOS los products.
2. FILTRADO: Solo ejecutar cuando el usuario seleccione categoría O escriba búsqueda.
3. MENSAJE "Sin resultados": Solo mostrar cuando filtered.length === 0.
4. DISEÑO: No modificar sin autorización. No agregar/eliminar animaciones.
5. COMENTARIOS (OBLIGATORIO): Comentar CADA línea de código explicando qué hace.
   Escribir comentarios claros, simples y útiles. NO omitir por considerarlos "obvios".
6. REGLA FINAL: "Si algo ya funcionaba, NO lo rompas. Si no se pidió, NO lo haces."

Este archivo contiene toda la funcionalidad JavaScript del sitio web.
Incluye:
- Gestión del tema claro/oscuro
- Datos de products
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
  PA8N-600:   img/pa8n600-1.png
  PA12N-1000: img/pa12n1000-1.png
  Sheffield12: img/pa12shieffield-1.png
  Sheffield10: img/pa10sheffield-1.png
- Estilos en css/styles.css:
  .prod-watermark (catálogo) y .modal-watermark (modal)
======================================================================

**/


// URL base de WhatsApp para enlaces de contacto
const WP = 'https://wa.me/573053402732';

// SVG del icono de WhatsApp (para usar dentro del modal)
const WP_SVG = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// Clave para guardar el tema en localStorage
const THEME_KEY = 'paTheme';

// ========================================
// SISTEMA DE CACHE DOM
// ========================================

/**
 * Objeto cache para almacenar referencias a elementos del DOM
 * Evita llamadas repetidas a getElementById
 */
const domCache = {};

/**
 * Inicializa el cache con los elementos más usados del sitio
 * Se llama una sola vez al cargar la página
 */
function initCache() {
  // Elementos del navbar
  domCache.navHamburger = document.getElementById('navHamburger');
  domCache.navLinks = document.getElementById('navLinks');
  domCache.navMobileOverlay = document.getElementById('navMobileOverlay');
  domCache.catalogSearch = document.getElementById('catalogSearch');
  domCache.catalogCategory = document.getElementById('catalogCategory');
  domCache.navSearchBox = document.getElementById('navSearchBox');
  domCache.navSearchTrigger = document.getElementById('navSearchTrigger');
  domCache.mobileMenuCategory = document.getElementById('mobileMenuCategory');
  domCache.mobileMenuSearch = document.getElementById('mobileMenuSearch');
  
  // Elementos del catálogo
  domCache.productsGrid = document.getElementById('productsGrid');
  domCache.products = document.getElementById('products');
  domCache.categoryActive = document.getElementById('categoryActive');
  domCache.categoryname = document.getElementById('categoryname');
  domCache.bannerTrack = document.getElementById('bannerTrack');
  
  // Elementos del modal
  domCache.modalOverlay = document.getElementById('modalOverlay');
  domCache.modal = document.getElementById('modal');
  domCache.modalBody = document.getElementById('modalBody');
  domCache.modalTitulo = document.getElementById('modalTitulo');
  domCache.modalImgMain = document.getElementById('modalImgMain');
  domCache.modalThumbs = document.getElementById('modalThumbs');
  domCache.modalInfo = document.getElementById('modalInfo');
  
  // Elementos de filtros móviles
  // Elementos de filtros móviles - ELIMINADOS (referenciaban elementos inexistentes)
  // Los filtros móviles usan: mobileMenuSearch y mobileMenuCategory (ya definidos arriba)
  
  // Audio
  domCache.introAudio = document.getElementById('introAudio');
}

/**
 * Función helper para obtener elementos del DOM con cache
 * @param {string} id - ID del elemento
 * @returns {HTMLElement|null}
 */
function $(id) {
  if (!domCache[id]) {
    domCache[id] = document.getElementById(id);
  }
  return domCache[id];
}

// ========================================
// BANDERAS DE ESTADO
// ========================================

// Configuración de paginación
const PAGINATION_CONFIG = {
  itemsPerPage: 8,  // products por página
  currentPage: 1    // Página actual
};

// ========================================
// CONTROL DE ZOOM
// ========================================

/**
 * Variables de estado para el control de zoom
 * minZoom: nivel mínimo (1 = sin zoom)
 * maxZoom: nivel máximo (3 = zoom 3x)
 * currentZoom: nivel actual de zoom
 */
const ZOOM_CONFIG = {
  minZoom: 1,
  maxZoom: 3,
  currentZoom: 1
};

/**
 * Realiza zoom in si no se ha alcanzado el máximo
 * @returns {boolean} true si el zoom se ejecutó, false si ya está en máximo
 */
function zoomIn() {
  if (ZOOM_CONFIG.currentZoom < ZOOM_CONFIG.maxZoom) {
    ZOOM_CONFIG.currentZoom = Math.min(ZOOM_CONFIG.currentZoom + 0.5, ZOOM_CONFIG.maxZoom);
    applyZoomToImages();
    return true;
  }
  return false;
}

/**
 * Realiza zoom out solo si el nivel actual es mayor que el mínimo
 * y si previamente se ha hecho zoom in
 * @returns {boolean} true si el zoom se ejecutó, false si está en nivel mínimo
 */
function zoomOut() {
  // Solo permitir zoom out si el nivel actual es mayor que el mínimo Y
  // el usuario ha hecho zoom in previamente (currentZoom > minZoom)
  if (ZOOM_CONFIG.currentZoom > ZOOM_CONFIG.minZoom) {
    ZOOM_CONFIG.currentZoom = Math.max(ZOOM_CONFIG.currentZoom - 0.5, ZOOM_CONFIG.minZoom);
    applyZoomToImages();
    return true;
  }
  // Si está en nivel mínimo, bloquear zoom out
  return false;
}

/**
 * Aplica el nivel de zoom actual a todas las imágenes del modal
 */
function applyZoomToImages() {
  const modalImgMain = document.getElementById('modalImgMain');
  if (modalImgMain) {
    modalImgMain.style.transform = 'scale(' + ZOOM_CONFIG.currentZoom + ')';
    modalImgMain.style.transition = 'transform 0.3s ease';
  }
  
  // Aplicar también a miniaturas si existen
  const thumbs = document.querySelectorAll('.modal-thumb img');
  thumbs.forEach(thumb => {
    thumb.style.transform = 'scale(' + ZOOM_CONFIG.currentZoom + ')';
    thumb.style.transition = 'transform 0.3s ease';
  });
}

/**
 * Maneja el evento de rueda del mouse para zoom
 * Solo activa zoom cuando el cursor está sobre la imagen principal del modal
 * Si el cursor NO está sobre la imagen, permite scroll normal
 * @param {WheelEvent} e - Evento de rueda
 */
function handleWheelZoom(e) {
  // Solo activar si el modal está abierto
  const modalOverlay = document.getElementById('modalOverlay');
  if (!modalOverlay || !modalOverlay.classList.contains('open')) return;
  
  // Obtener la imagen principal del modal
  const modalImgMain = document.getElementById('modalImgMain');
  if (!modalImgMain) return;
  
  // Verificar si el cursor está sobre la imagen principal
  const imgRect = modalImgMain.getBoundingClientRect();
  const isOverImage = (
    e.clientX >= imgRect.left &&
    e.clientX <= imgRect.right &&
    e.clientY >= imgRect.top &&
    e.clientY <= imgRect.bottom
  );
  
  // Si el cursor NO está sobre la imagen, permitir scroll normal (no prevenir default)
  if (!isOverImage) {
    return; // Sale de la función sin preventDefault, permitiendo scroll normal
  }
  
  // Si el cursor está sobre la imagen, aplicar zoom
  e.preventDefault();
  
  if (e.deltaY < 0) {
    // Scroll hacia arriba = zoom in
    zoomIn();
  } else {
    // Scroll hacia abajo = zoom out
    zoomOut();
  }
}

/**
 * Inicializa los eventos de zoom para el modal
 */
function initZoomControls() {
  // Agregar listener para zoom con rueda del mouse
  document.addEventListener('wheel', handleWheelZoom, { passive: false });
  
  // Agregar eventos táctiles para pinch-to-zoom en móviles
  let initialDistance = 0;
  let initialZoom = ZOOM_CONFIG.currentZoom;
  
  document.addEventListener('touchstart', function(e) {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay || !modalOverlay.classList.contains('open')) return;
    
    if (e.touches.length === 2) {
      initialDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialZoom = ZOOM_CONFIG.currentZoom;
    }
  }, { passive: true });
  
  document.addEventListener('touchmove', function(e) {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay || !modalOverlay.classList.contains('open')) return;
    
    if (e.touches.length === 2) {
      e.preventDefault();
      
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Calcular el factor de cambio
      const scale = currentDistance / initialDistance;
      let newZoom = initialZoom * scale;
      
      // Limitar el zoom entre minZoom y maxZoom
      newZoom = Math.max(ZOOM_CONFIG.minZoom, Math.min(newZoom, ZOOM_CONFIG.maxZoom));
      
      // Solo permitir zoom out si el nivel actual es mayor que el mínimo
      if (newZoom < ZOOM_CONFIG.currentZoom && ZOOM_CONFIG.currentZoom <= ZOOM_CONFIG.minZoom) {
        // Bloquear zoom out si ya está en nivel mínimo
        return;
      }
      
      ZOOM_CONFIG.currentZoom = newZoom;
      applyZoomToImages();
    }
  }, { passive: false });
}

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
 * Cierra el menú móvil solo si está abierto y actualiza el enlace activo
 * @param {Event} e - Evento del clic
 * @param {string} sectionId - ID de la sección destino
 */
function handleNavClick(e, sectionId) {
  // Cerrar menú móvil SOLO si está abierto
  const navLinks = document.getElementById('navLinks');
  const isMobileMenuOpen = navLinks && navLinks.classList.contains('open');
  
  if (isMobileMenuOpen) {
    toggleMobileMenu();
  }
  
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
 * Solo se reproduce una vez al cargar la página cuando está en el inicio
 * Se detiene al hacer scroll hacia otra sección y no vuelve a reproducirse
 */
function initIntroAudio() {
  const audio = document.getElementById('introAudio');
  if (!audio) return;

  let introStarted = false;

  // Función para detener el audio con fade out
 function stopIntro() {
  let fade = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      clearInterval(fade);
      audio.pause();
      audio.volume = 0.6;
      introStarted = false;
    }
  }, 80);
}

  // Función para reproducir el audio (solo una vez)
  function playAudio() {
    // Solo reproducir si está en el inicio (scrollY < 100)
    if (introStarted || window.scrollY >= 100) return;
    
    introStarted = true;
    audio.volume = 0.5;
    audio.play()
      .catch(function (err) {
        console.log('Audio bloqueado por el navegador');
        introStarted = false;
      });
  }

  // Función que maneja el scroll
  function onScroll() {
    // Detener cuando el usuario hace scroll hacia otra sección
    if (window.scrollY >= 100 && introStarted) {
      stopIntro();
      // Resetear introStarted para que pueda reproducirse de nuevo al volver arriba
     // introStarted = false;
    }
    // Intentar reproducir si vuelve al inicio
    if (window.scrollY < 100 && !introStarted) {
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
// DATOS DE products
// ========================================

/**
 * Array de objetos con los datos de cada producto
 * Para agregar un producto: copiar un objeto, cambiar los datos e imágenes
 */
let products = [];

async function loadProducts() {

  try {

    const response = await fetch("data/products.json");
    const data = await response.json();

    products = data.map(p => ({
      id: p.name.toLowerCase(),
      name: p.name.toUpperCase(),
      cat: p.category || "Parlantes",
      badge: "Producto",
      desc: "Producto de audio profesional",

      imgs: [
        p.images?.main || "",
        p.images?.watermark || ""
      ].filter(Boolean),

      watermark: p.images?.watermark || null,

      specs: p.specs || [],
      apps: [],
      tags: [],

      doc: p.document || null
      }));

    renderBanner();
    renderProducts();

  } catch (error) {
    console.error("Error cargando products.json:", error);
  }

}

// ========================================
// BANNER CARRUSEL
// ========================================

/**
 * Maneja el clic en un item del banner
 * @param {string} id - ID del producto
 */
function onBannerItemClick(id) {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => openModal(id), 450);
}

/**
 * Renderiza el banner carrusel con las imágenes de products
 */
function renderBanner() {
  const track = document.getElementById('bannerTrack');
  if (!track) return;

    const items = products.map(p => ({
    src: p.imgs[0],   // solo la imagen principal
    alt: p.name,
    id: p.id
  }));
  /* Triplicar los items para evitar el salto visible del loop en pantallas anchas */
  const duplicated = [...items, ...items, ...items];

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
 * @param {Object} p - Objeto del producto
 * @returns {string} Texto normalizado para búsqueda
 */
function getProductSearchText(p) {
  const parts = [p.name, p.cat, p.desc, (p.tags || []).join(' '), (p.apps || []).join(' ')];
  return parts.join(' ').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Filtra los products según búsqueda y categoría seleccionados
 * @returns {Array} Array de products filtrados
 */
function getFilteredproducts() {
  const searchEl = document.getElementById('catalogSearch');
  const categoryEl = document.getElementById('catalogCategory');
  const query = (searchEl && searchEl.value) ? searchEl.value.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') : '';
  const category = (categoryEl && categoryEl.value) ? categoryEl.value.trim().toLowerCase() : '';

  let list = products;
  if (category) list = list.filter(p => (p.cat || '').toLowerCase().includes(category));
  if (query) list = list.filter(p => getProductSearchText(p).includes(query));
  return list;
}


/**
 * Obtiene las categorías únicas de los products
 * ORDEN FIJO: Parlantes, Drivers, Cabinas, Line Array
 * @returns {Array} Array de names de categorías en orden específico
 */
function getUniqueCategories() {
  // Categorías fijas requeridas por el proyecto (en orden específico)
  const fixedCategories = ['Parlantes', 'Drivers', 'Cabinas', 'Line Array'];
  
  // Obtener categorías de products existentes
  const productCategories = [];
  products.forEach(p => { 
    if (p.cat && !productCategories.includes(p.cat)) {
      productCategories.push(p.cat);
    }
  });
  
  // Combinar: primero las fijas, luego las adicionales de products (sin duplicados)
  const allCategories = [...new Set([...fixedCategories, ...productCategories])];
  
  return allCategories;
}

/**
 * Llena el selector de categorías con las opciones disponibles
 */
function fillCategorySelect() {
  const sel = document.getElementById('catalogCategory');
  const mobileMenuCategory = document.getElementById('mobileMenuCategory');
  const current = sel ? sel.value : '';
  const categories = getUniqueCategories();
  
  const optionsHTML = '<option value="">Todas las categorías</option>' +
    categories.map(c => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join('');
  
  if (sel) {
    sel.innerHTML = optionsHTML;
    if (categories.includes(current)) sel.value = current;
  }
  
  // Llenar el selector de categorías en el menú móvil si existe
  if (mobileMenuCategory) {
    mobileMenuCategory.innerHTML = optionsHTML;
  }
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
  return String(text || '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

/**
 * Renderiza las tarjetas de products en el grid con paginación
 */
function renderProducts() {
  const filtered = getFilteredproducts();
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Actualizar contador de productos
  // Formato: "Pag. 1. 1-8 / 9" (página actual, rango de productos mostrados, total)
  const productsCount = document.getElementById('productsCount');
  if (productsCount) {
    const total = filtered.length;
    const itemsPerPage = PAGINATION_CONFIG.itemsPerPage;
    const currentPage = PAGINATION_CONFIG.currentPage;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    const startItem = startIndex + 1;
    productsCount.innerHTML = `Pag. ${currentPage}. ${startItem}-${endIndex} / ${total}`;
  }

  // Obtener valores de los filtros activos
  const searchEl = document.getElementById('catalogSearch');
  const categoryEl = document.getElementById('catalogCategory');
  const query = (searchEl && searchEl.value) ? searchEl.value.trim() : '';
  const category = (categoryEl && categoryEl.value) ? categoryEl.value.trim() : '';
  
  // Actualizar indicador de categoría activa
  const categoryActive = document.getElementById('categoryActive');
  const categoryname = document.getElementById('categoryname');
  if (categoryActive && categoryname) {
    if (category) {
      categoryname.textContent = category;
      categoryActive.style.display = 'inline-flex';
    } else {
      categoryActive.style.display = 'none';
    }
  }
  
  // Solo mostrar mensaje de "sin resultados" si hay filtros activos Y no hay products
  const hayFiltrosActivos = query !== '' || category !== '';
  
  if (filtered.length === 0 && hayFiltrosActivos) {
    grid.innerHTML = `
      <div class="catalog-empty" style="grid-column:1/-1;text-align:center;padding:3rem 2rem;background:var(--bg3);border:1px solid var(--borde);border-radius:12px;">
        <p style="font-size:1rem;color:var(--texto);margin-bottom:.5rem;">No hay products con los filtros seleccionados.</p>
        <p style="font-size:.85rem;color:var(--muted);">Cambia la categoría o el texto de búsqueda.</p>
      </div>
    `;
    // Ocultar controles de paginación
    const paginationControls = document.getElementById('paginationControls');
    if (paginationControls) paginationControls.style.display = 'none';
    return;
  }

  // Calcular paginación
  const totalItems = filtered.length;
  const itemsPerPage = PAGINATION_CONFIG.itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Asegurar que la página actual sea válida
  if (PAGINATION_CONFIG.currentPage > totalPages) {
    PAGINATION_CONFIG.currentPage = totalPages || 1;
  }
  if (PAGINATION_CONFIG.currentPage < 1) {
    PAGINATION_CONFIG.currentPage = 1;
  }
  
  // Obtener products de la página actual
  const startIndex = (PAGINATION_CONFIG.currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageProducts = filtered.slice(startIndex, endIndex);

  const grouped = {};
  pageProducts.forEach(p => {
    if (!grouped[p.cat]) grouped[p.cat] = [];
    grouped[p.cat].push(p);
  });

  let html = '';
  let delay = 0;
  const categories = Object.keys(grouped);
  
  categories.forEach((cat, catIndex) => {
    if (catIndex > 0) {
      html += `<div class="prod-category-header"><span>${cat}</span></div>`;
    }
    
    grouped[cat].forEach((p) => {
      html += `
<div class="prod-card" style="--card-delay: ${delay * 0.07}s" onclick="openModal('${p.id}')">
          <div class="prod-img-wrap">
            <img src="${p.imgs[0]}" alt="${p.name}"/>
            ${p.watermark ? `<img src="${p.watermark}" alt="" class="prod-watermark"/>` : ''}
            <!-- Escapar el badge para evitar inyección de código malicioso -->
            <span class="prod-badge">${escapeHtml(p.badge)}</span>
          </div>
          <div class="prod-body">
            <!-- Escapar la categoría para mostrarla de forma segura -->
            <div class="prod-cat">${escapeHtml(p.cat)}</div>
            <!-- Escapar el name del producto para evitar XSS -->
            <div class="prod-name">${escapeHtml(p.name)}</div>
            <!-- Escapar la descripción para mostrarla de forma segura -->
            <div class="prod-desc">${escapeHtml(p.desc)}</div>
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
  
  // Renderizar controles de paginación
  renderPaginationControls(totalPages, PAGINATION_CONFIG.currentPage);
}

/**
 * Renderiza los controles de paginación
 * @param {number} totalPages - Total de páginas
 * @param {number} currentPage - Página actual
 */
function renderPaginationControls(totalPages, currentPage) {
  let paginationContainer = document.getElementById('paginationControls');
  
  // Si no existe el contenedor, crearlo
  if (!paginationContainer) {
    const productsSection = document.getElementById('products');
    if (!productsSection) return;
    
    paginationContainer = document.createElement('div');
    paginationContainer.id = 'paginationControls';
    paginationContainer.className = 'pagination-controls';
    productsSection.appendChild(paginationContainer);
  }
  
  // Si solo hay una página, mostrar solo el indicador sin botones
  if (totalPages <= 1) {
    paginationContainer.innerHTML = `
      <div class="pagination-info">
        <span class="pagination-current">1</span>
        <span class="pagination-separator">/</span>
        <span class="pagination-total">1</span>
      </div>
    `;
    paginationContainer.style.display = 'flex';
    return;
  }
  
  // Generar HTML de controles
  paginationContainer.innerHTML = `
    <button class="pagination-btn pagination-prev" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      ‹
    </button>
    <div class="pagination-info">
      <span class="pagination-current">${currentPage}</span>
      <span class="pagination-separator">/</span>
      <span class="pagination-total">${totalPages}</span>
    </div>
    <button class="pagination-btn pagination-next" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      ›
    </button>
  `;
  
  paginationContainer.style.display = 'flex';
}

/**
 * Cambia de página en la paginación
 * @param {number} page - Número de página al que cambiar
 */
function changePage(page) {
  const filtered = getFilteredproducts();
  const totalPages = Math.ceil(filtered.length / PAGINATION_CONFIG.itemsPerPage);
  
  if (page < 1 || page > totalPages) return;
  
  PAGINATION_CONFIG.currentPage = page;
  renderProducts();
  
  // Scroll suave al inicio del grid de products
  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Configura los eventos de los filtros de búsqueda y categoría
 */
function setupCatalogFilters() {
  // Llenar el selector de categorías
  fillCategorySelect();
  
  // Elementos del escritorio
  const searchEl = document.getElementById('catalogSearch');
  const categoryEl = document.getElementById('catalogCategory');
  // Elementos del menú móvil
  const mobileMenuCategory = document.getElementById('mobileMenuCategory');
  const mobileMenuSearch = document.getElementById('mobileMenuSearch');
  // Elementos de la caja de búsqueda
  const searchBox = document.getElementById('navSearchBox');
  const searchTrigger = document.getElementById('navSearchTrigger');

// Evento de búsqueda en escritorio - sin scroll automático al escribir
  if (searchEl) {
    searchEl.addEventListener('input', function() {
      PAGINATION_CONFIG.currentPage = 1; // Reiniciar a página 1 al buscar
      renderProducts();
      // No hacer scroll automáticamente al escribir
    });
    // Agregar soporte para tecla Enter en búsqueda de escritorio
    searchEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        renderProducts();
        // Scroll a products solo al presionar Enter
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Evento de categoría en escritorio
  if (categoryEl) categoryEl.addEventListener('change', function() {
    PAGINATION_CONFIG.currentPage = 1; // Reiniciar a página 1 al cambiar categoría
    renderProducts();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });

  // Evento para el selector de categorías en menú móvil
  if (mobileMenuCategory) mobileMenuCategory.addEventListener('change', function() {
    if (categoryEl) categoryEl.value = mobileMenuCategory.value;
    PAGINATION_CONFIG.currentPage = 1; // Reiniciar a página 1 al cambiar categoría
    renderProducts();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });


  // Evento para búsqueda en menú móvil - sin scroll automático al escribir
  if (mobileMenuSearch) {
    mobileMenuSearch.addEventListener('input', function() {
      if (searchEl) {
        searchEl.value = mobileMenuSearch.value;
        PAGINATION_CONFIG.currentPage = 1; // Reiniciar a página 1 al buscar
        renderProducts();
        // No hacer scroll automáticamente al escribir - el usuario debe presionar Enter o buscar manualmente
      }
    });
    // Agregar soporte para tecla Enter en búsqueda móvil
    mobileMenuSearch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Sincronizar valor antes de buscar
        if (searchEl) {
          searchEl.value = mobileMenuSearch.value;
          renderProducts();
        }
        // Cerrar el menú móvil si está abierto
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('open')) {
          toggleMobileMenu();
        }
        // Scroll a products solo al presionar Enter
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Configuración de la caja de búsqueda expandible
  if (searchBox && searchTrigger && searchEl) {
    searchTrigger.addEventListener('click', () => {
      const isExpanded = searchBox.classList.toggle('expanded');
      searchTrigger.setAttribute('aria-expanded', isExpanded);
      if (isExpanded) {
        searchEl.focus();
      }
    });
    searchEl.addEventListener('blur', () => {
      setTimeout(() => {
        searchBox.classList.remove('expanded');
        searchTrigger.setAttribute('aria-expanded', 'false');
      }, 180);
    });
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

/**
 * Abre el modal con los detalles de un producto
 * @param {string} id - ID del producto a mostrar
 */
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const mb = document.getElementById('modalBody');
  const oldWm = mb.querySelector('.modal-watermark');
  if (oldWm) oldWm.remove();
  if(p.watermark) {
    const wm = document.createElement('img');
    wm.src = p.watermark;
    wm.className = 'modal-watermark';
    mb.appendChild(wm);
  }

  document.getElementById('modalTitulo').textContent = p.name;
  document.getElementById('modalImgMain').src = p.imgs[0];
  /* Asignar texto descriptivo al alt de la imagen para lectores de pantalla */
  document.getElementById('modalImgMain').alt = 'Imagen de ' + p.name;

  document.getElementById('modalThumbs').innerHTML = p.imgs.map((img, i) => `
    <div class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="cambiarImg('${img}', this)">
      <img src="${img}" alt=""/>
    </div>
  `).join('');

  document.getElementById('modalInfo').innerHTML = `
    <span class="modal-badge">${p.badge}</span>
    <div class="modal-cat">${p.cat}</div>
    <div class="modal-name">${p.name}</div>
    <div class="modal-desc">${p.desc}</div>
    <table class="modal-tabla">
  ${(p.specs || []).map(([k, v]) => `
    <tr>
      <td>${k}</td>
      <td>${v || '-'}</td>
    </tr>
  `).join('')}
</table>

    <div class="modal-apps">
      <h4>Aplicaciones</h4>
     <ul>${(p.apps || []).map(a => `<li>${a}</li>`).join('')}</ul>
    </div>
<a href="${WP}?text=${encodeURIComponent('Hola, me interesa el ' + p.name + '. ¿Pueden darme información y precio?')}"
       target="_blank" rel="noopener noreferrer" class="modal-wp">
      ${WP_SVG} Consultar por WhatsApp
    </a>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Guardar referencia al elemento que tenía el foco antes de abrir el modal */
  openModal._focusAnterior = document.activeElement;

  /* Obtener todos los elementos enfocables dentro del modal */
  const modal = document.getElementById('modal');
  const enfocables = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  /* Primer y último elemento enfocable del modal */
  const primero = enfocables[0];
  const ultimo = enfocables[enfocables.length - 1];

  /* Función que atrapa el foco dentro del modal al presionar Tab */
  function trapFocus(e) {
    if (e.key !== 'Tab') return; /* Solo actuar cuando se presiona Tab */
    if (e.shiftKey) {
      /* Si se presiona Shift+Tab y el foco está en el primero, ir al último */
      if (document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      }
    } else {
      /* Si se presiona Tab y el foco está en el último, volver al primero */
      if (document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  }

  /* Registrar el listener del focus trap y guardarlo para poder eliminarlo después */
  document.addEventListener('keydown', trapFocus);
  openModal._trapFocus = trapFocus; /* Guardar referencia para eliminar en cerrarModalBtn */

  /* Enfocar el primer elemento del modal al abrirlo */
  if (primero) primero.focus();
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
function cerrarModal(e) {
  if (e.target === document.getElementById('modalOverlay')) cerrarModalBtn();
}

/**
 * Cierra el modal y restaura el scroll
 */
function cerrarModalBtn() {
  /* Eliminar el listener del focus trap al cerrar el modal */
  if (openModal._trapFocus) {
    document.removeEventListener('keydown', openModal._trapFocus);
    openModal._trapFocus = null; /* Limpiar la referencia */
  }
  /* Devolver el foco al elemento que lo tenía antes de abrir el modal */
  if (openModal._focusAnterior) {
    openModal._focusAnterior.focus();
    openModal._focusAnterior = null; /* Limpiar la referencia */
  }

  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModalBtn(); });

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
    
    if (scrollPos < heroHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      return;
    }
    
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

document.addEventListener('DOMContentLoaded', function() {
  initCache();
  loadTheme();
  initIntroAudio();
  loadProducts();
  setupCatalogFilters();
  initActiveMenuLink();
  initZoomControls();
  // Crear el observador de intersección para las animaciones de reveal
  const obs = new IntersectionObserver(entries => {
    // Por cada entrada del observador, agregar clase 'visible' si el elemento es visible
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  // Observar todos los elementos con clase 'reveal'
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});
