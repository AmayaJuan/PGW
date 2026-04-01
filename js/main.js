/**
======================================================================
PA ACOUSTIC — main.js
======================================================================
**/

const WP = 'https://wa.me/573053402732';
const WP_SVG = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// ========================================
// CACHE DOM
// ========================================
const domCache = {};
function initCache() {
  domCache.navHamburger      = document.getElementById('navHamburger');
  domCache.navLinks          = document.getElementById('navLinks');
  domCache.navMobileOverlay  = document.getElementById('navMobileOverlay');
  domCache.catalogSearch     = document.getElementById('catalogSearch');
  domCache.catalogCategory   = document.getElementById('catalogCategory');
  domCache.navSearchBox      = document.getElementById('navSearchBox');
  domCache.navSearchTrigger  = document.getElementById('navSearchTrigger');
  domCache.mobileMenuCategory= document.getElementById('mobileMenuCategory');
  domCache.mobileMenuSearch  = document.getElementById('mobileMenuSearch');
  domCache.productsGrid      = document.getElementById('productsGrid');
  domCache.products          = document.getElementById('products');
  domCache.categoryActive    = document.getElementById('categoryActive');
  domCache.bannerTrack       = document.getElementById('bannerTrack');
  domCache.modalOverlay      = document.getElementById('modalOverlay');
  domCache.modal             = document.getElementById('modal');
  domCache.modalBody         = document.getElementById('modalBody');
  domCache.modalTitulo       = document.getElementById('modalTitulo');
  domCache.modalImgMain      = document.getElementById('modalImgMain');
  domCache.modalThumbs       = document.getElementById('modalThumbs');
  domCache.modalInfo         = document.getElementById('modalInfo');
  domCache.introAudio        = document.getElementById('introAudio');
}
function $(id) {
  if (!domCache[id]) domCache[id] = document.getElementById(id);
  return domCache[id];
}

// ========================================
// PAGINACIÓN
// ========================================
const PAGINATION_CONFIG = { itemsPerPage: 8, currentPage: 1 };

// ========================================
// ZOOM
// ========================================
const ZOOM_CONFIG = { 
  levels: [0.5, 0.8, 1, 1.5, 2], 
  currentLevel: 2, 
  currentZoom: 1 
};

function zoomStep(direction) {
  ZOOM_CONFIG.currentLevel = Math.max(0, Math.min(ZOOM_CONFIG.levels.length - 1, ZOOM_CONFIG.currentLevel + direction));
  ZOOM_CONFIG.currentZoom = ZOOM_CONFIG.levels[ZOOM_CONFIG.currentLevel];
  applyZoomToImages();
}

function zoomIn() {
  if (ZOOM_CONFIG.currentZoom < ZOOM_CONFIG.maxZoom) {
    ZOOM_CONFIG.currentZoom = Math.min(ZOOM_CONFIG.currentZoom + 0.5, ZOOM_CONFIG.maxZoom);
    applyZoomToImages(); return true;
  }
  return false;
}
function zoomOut() {
  if (ZOOM_CONFIG.currentZoom > ZOOM_CONFIG.minZoom) {
    ZOOM_CONFIG.currentZoom = Math.max(ZOOM_CONFIG.currentZoom - 0.5, ZOOM_CONFIG.minZoom);
    applyZoomToImages(); return true;
  }
  return false;
}
function applyZoomToImages() {
  const img = document.getElementById('modalImgMain');
  if (img) {
    img.style.transform  = 'scale(' + ZOOM_CONFIG.currentZoom + ')';
    img.style.transition = 'transform 0.3s ease';
  }
}
function handleWheelZoom(e) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  const img = document.getElementById('modalImgMain');
  if (!img) return;
  const r = img.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
  e.preventDefault();
  zoomStep(e.deltaY < 0 ? 1 : -1); // ✅ Solo niveles discretos
}
function initZoomControls() {
  document.addEventListener('wheel', handleWheelZoom, { passive: false });
  let initialDistance = 0, initialZoom = 1;
  document.addEventListener('touchstart', function(e) {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.touches.length === 2) {
      initialDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      initialZoom = ZOOM_CONFIG.currentZoom;
    }
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      let newZoom = Math.max(ZOOM_CONFIG.minZoom, Math.min(initialZoom * (d / initialDistance), ZOOM_CONFIG.maxZoom));
      if (newZoom < ZOOM_CONFIG.currentZoom && ZOOM_CONFIG.currentZoom <= ZOOM_CONFIG.minZoom) return;
      ZOOM_CONFIG.currentZoom = newZoom;
      applyZoomToImages();
    }
  }, { passive: false });
}

// ========================================
// NAVEGACIÓN
// ========================================
function handleLogoClick(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'instant' });
  clearNavActive();
}
function handleNavClick(e, sectionId) {
  const nl = document.getElementById('navLinks');
  if (nl && nl.classList.contains('open')) toggleMobileMenu();
  setTimeout(() => clearNavActive(), 100);
}
function clearNavActive() {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
}

// ========================================
// AUDIO
// ========================================
function initIntroAudio() {
  const audio = document.getElementById('introAudio');
  if (!audio) return;
  let started = false;
  function stop() {
    let fade = setInterval(() => {
      if (audio.volume > 0.05) audio.volume -= 0.05;
      else { clearInterval(fade); audio.pause(); audio.volume = 0.6; started = false; }
    }, 80);
  }
  function play() {
    if (started || window.scrollY >= 100) return;
    started = true;
    audio.volume = 0.5;
    audio.play().catch(() => { started = false; });
  }
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 100 && started) stop();
    if (window.scrollY < 100 && !started) play();
  }, { passive: true });
  play();
  document.addEventListener('click', function f() { if (window.scrollY < 100) play(); document.removeEventListener('click', f); }, { once: true });
}

// ========================================
// PRODUCTOS
// ========================================
let products = [];

async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    const data = await response.json();
    products = data.map(p => {
      const mainImg    = p.images?.main || "";
      const rawGallery = p.images?.gallery;
      const extraImgs  = Array.isArray(rawGallery) ? rawGallery : [];
      const gallery    = [mainImg, ...extraImgs.filter(u => u && u !== mainImg)].filter(Boolean);

      return {
        id:        p.name.toLowerCase().replace(/\s+/g, '-'),
        name:      p.name.toUpperCase(),
        cat:       p.category || "Parlantes",
        badge:     "Producto",
        desc:      p.description || "Producto de audio profesional",
        imgs:      gallery,
        watermark: p.images?.watermark || null,
        specs:     p.specs ? Object.entries(p.specs).filter(([k]) => k !== 'aplicaciones') : [],
        apps:      p.specs?.aplicaciones
                     ? (typeof p.specs.aplicaciones === 'string'
                         ? p.specs.aplicaciones.split(',').map(s => s.trim())
                         : p.specs.aplicaciones)
                     : [],
        tags:      [],
        video:     p.video || null,
        doc:       p.document || null
      };
    });
    renderBanner();
    renderProducts();
  } catch (e) { console.error("Error cargando products.json:", e); }
}

// ========================================
// BANNER
// ========================================
function onBannerItemClick(id) {
  document.getElementById('products').scrollIntoView({ behavior: 'instant' });
  setTimeout(() => openModal(id), 450);
}
function renderBanner() {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  const items = products.map(p => ({ src: p.imgs[0], alt: p.name, id: p.id }));
  const dup   = [...items, ...items, ...items];
  track.innerHTML = dup.map(({ src, alt, id }) => `
    <div class="banner-item" onclick="onBannerItemClick('${id}')" role="button" tabindex="0" aria-label="Ver ${alt}">
      <img src="${src}" alt="${alt}" loading="lazy"/>
    </div>`).join('');
}

// ========================================
// VIDEO EMBED
// ========================================
function getVideoEmbed(url) {
  if (!url) return null;

  // Cloudinary — genera thumb automático desde el frame 0
  if (url.includes('res.cloudinary.com') && url.match(/\.(mp4|webm|mov)(\?|$)/i)) {
    const thumb = url
      .replace('/video/upload/', '/video/upload/so_0/')
      .replace(/\.(mp4|webm|mov)(\?|$)/i, '.jpg');
    return { type: 'video', src: url, thumb };
  }

  // Video directo genérico
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return { type: 'video', src: url, thumb: null };
  }

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return {
    type: 'iframe',
    src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    thumb: null
  };

  // YouTube Shorts
  const ytShorts = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (ytShorts) return {
    type: 'iframe',
    src: `https://www.youtube.com/embed/${ytShorts[1]}?rel=0`,
    thumb: null
  };

  return null;
}

// ========================================
// FILTROS
// ========================================
function getProductSearchText(p) {
  return [p.name, p.cat, p.desc, (p.tags||[]).join(' '), (p.apps||[]).join(' ')].join(' ').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
function getResponsiveSrcset(imgUrl) {
  return imgUrl; // Cloudinary optimiza automáticamente — evitar 404 srcset
}

function getFilteredProducts() {
  const se = document.getElementById('catalogSearch');
  const ce = document.getElementById('catalogCategory');
  const q  = se?.value ? se.value.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') : '';
  const c  = ce?.value ? ce.value.trim().toLowerCase() : '';
  let list = products;
  if (c) list = list.filter(p => (p.cat||'').toLowerCase() === c);
  if (q) list = list.filter(p => getProductSearchText(p).includes(q));
  return list;
}
function getUniqueCategories() {
  const fixed = ['Line Array','Woofer','Drivers','Cabinas'];
  const from  = [];
  products.forEach(p => { if (p.cat && !from.includes(p.cat)) from.push(p.cat); });
  return [...new Set([...fixed, ...from])];
}
function fillCategorySelect() {
  const sel = document.getElementById('catalogCategory');
  const mob = document.getElementById('mobileMenuCategory');
  const cur = sel?.value || '';
  const cats = getUniqueCategories();
  const html = '<option value="">Todas las categorías</option>' + cats.map(c => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join('');
  if (sel) { sel.innerHTML = html; if (cats.includes(cur)) sel.value = cur; }
  if (mob) mob.innerHTML = html;
}
function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t||''; return d.innerHTML; }
function escapeAttr(t) { return String(t||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ========================================
// RENDER PRODUCTOS
// ========================================
function renderProducts() {
  const filtered  = getFilteredProducts();
  const grid      = document.getElementById('productsGrid');
  if (!grid) return;

  const se       = document.getElementById('catalogSearch');
  const ce       = document.getElementById('catalogCategory');
  const query    = se?.value ? se.value.trim() : '';
  const category = ce?.value ? ce.value.trim() : '';

  const pc = document.getElementById('productsCount');
  if (pc) {
    const total = filtered.length;
    const ip    = PAGINATION_CONFIG.itemsPerPage;
    const cp    = PAGINATION_CONFIG.currentPage;
    const start = Math.min(total, cp * ip);
    const end   = cp * ip;
    if (total > 0) {
      pc.innerHTML = `<span class="count-label">Página</span><span class="count-current">${cp}</span><span class="count-range">${start}-${end}</span>${!category && !query ? `<span class="count-label">Total:</span><span class="categoria-badge" style="background:var(--rojo);color:#fff;padding:0.2rem 0.7rem;border-radius:20px;font-size:0.75rem;font-weight:600;">${total} productos</span>` : ''}`;
      pc.style.display = 'inline-flex';
    } else { pc.style.display = 'none'; }
  }

  const ca = document.getElementById('categoryActive');
  const cn = document.getElementById('categoryName');
  if (ca && cn) {
    if (category) {
      const count = products.filter(p => (p.cat||'').toLowerCase() === category.toLowerCase()).length;
      cn.textContent = category + ' (' + count + ' productos)';
      ca.style.display = 'inline-flex';
    } else { ca.style.display = 'none'; }
  }

  if (filtered.length === 0 && (query || category)) {
    grid.innerHTML = `<div class="catalog-empty" style="grid-column:1/-1;text-align:center;padding:3rem 2rem;background:var(--bg3);border:1px solid var(--borde);border-radius:12px;"><p style="font-size:1rem;color:var(--texto);margin-bottom:.5rem;">No hay productos con los filtros seleccionados.</p><p style="font-size:.85rem;color:var(--muted);">Cambia la categoría o el texto de búsqueda.</p></div>`;
    const pgc = document.getElementById('paginationControls');
    if (pgc) pgc.style.display = 'none';
    return;
  }

  const total = filtered.length;
  const ip    = PAGINATION_CONFIG.itemsPerPage;
  const tp    = Math.ceil(total / ip);
  if (PAGINATION_CONFIG.currentPage > tp) PAGINATION_CONFIG.currentPage = tp || 1;
  if (PAGINATION_CONFIG.currentPage < 1)  PAGINATION_CONFIG.currentPage = 1;

  const start   = (PAGINATION_CONFIG.currentPage - 1) * ip;
  const page    = filtered.slice(start, start + ip);
  const grouped = {};
  page.forEach(p => { if (!grouped[p.cat]) grouped[p.cat] = []; grouped[p.cat].push(p); });

  let html = ''; let delay = 0;
  Object.keys(grouped).forEach((cat, i) => {
    if (i > 0) html += `<div class="prod-category-header"><span>${cat}</span></div>`;
    grouped[cat].forEach(p => {
      const hasGallery = p.imgs.length > 1 || !!p.video;
      const mediaCount = p.imgs.length + (p.video ? 1 : 0);
      html += `<div class="prod-card" style="--card-delay:${delay*0.07}s" onclick="openModal('${p.id}')">
        <div class="prod-img-wrap">
          <img src="${p.imgs[0]}" alt="${escapeAttr(p.name)}" loading="lazy"/>
          ${p.watermark ? `<img src="${p.watermark}" alt="" class="prod-watermark"/>` : ''}
          <span class="prod-badge">${escapeHtml(p.badge)}</span>
          ${hasGallery ? `<span class="prod-gallery-count" title="${mediaCount} archivos">${p.video ? '🎬' : '📷'} ${mediaCount}</span>` : ''}
        </div>
        <div class="prod-body">
          <div class="prod-cat">${escapeHtml(p.cat)}</div>
          <div class="prod-name">${escapeHtml(p.name)}</div>
          <div class="prod-desc">${escapeHtml(p.desc)}</div>
          <div class="prod-specs">${p.tags.map(t=>`<span class="spec-tag">${t}</span>`).join('')}</div>
          <div class="prod-footer"><button class="prod-btn">Ver más →</button></div>
        </div>
      </div>`;
      delay++;
    });
  });
  grid.innerHTML = html;
  renderPaginationControls(tp, PAGINATION_CONFIG.currentPage);
}

function renderPaginationControls(totalPages, currentPage) {
  let pg = document.getElementById('paginationControls');
  if (!pg) {
    const sec = document.getElementById('products');
    if (!sec) return;
    pg = document.createElement('div');
    pg.id = 'paginationControls';
    pg.className = 'pagination-controls';
    sec.appendChild(pg);
  }
  if (totalPages <= 1) {
    pg.innerHTML = `<div class="pagination-info"><span class="pagination-current">1</span><span class="pagination-separator">/</span><span class="pagination-total">1</span></div>`;
    pg.style.display = 'flex'; return;
  }
  pg.innerHTML = `
    <button class="pagination-btn" onclick="changePage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>
    <div class="pagination-info"><span class="pagination-current">${currentPage}</span><span class="pagination-separator">/</span><span class="pagination-total">${totalPages}</span></div>
    <button class="pagination-btn" onclick="changePage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>›</button>`;
  pg.style.display = 'flex';
}

function changePage(page) {
  const f  = getFilteredproducts();
  const tp = Math.ceil(f.length / PAGINATION_CONFIG.itemsPerPage);
  if (page < 1 || page > tp) return;
  PAGINATION_CONFIG.currentPage = page;
  renderProducts();
  const sec = document.getElementById('products');
  if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
}

function setupCatalogFilters() {
  fillCategorySelect();
  const se    = document.getElementById('catalogSearch');
  const ce    = document.getElementById('catalogCategory');
  const mob_c = document.getElementById('mobileMenuCategory');
  const mob_s = document.getElementById('mobileMenuSearch');
  const sb    = document.getElementById('navSearchBox');
  const st    = document.getElementById('navSearchTrigger');

  if (se) {
    se.addEventListener('input', () => { PAGINATION_CONFIG.currentPage = 1; renderProducts(); });
    se.addEventListener('keydown', e => { if (e.key==='Enter') { e.preventDefault(); renderProducts(); document.getElementById('products').scrollIntoView({behavior:'instant'}); } });
  }
  if (ce) ce.addEventListener('change', () => { PAGINATION_CONFIG.currentPage=1; renderProducts(); document.getElementById('products').scrollIntoView({behavior:'instant'}); });
  if (mob_c) mob_c.addEventListener('change', () => { if (ce) ce.value=mob_c.value; PAGINATION_CONFIG.currentPage=1; renderProducts(); document.getElementById('products').scrollIntoView({behavior:'instant'}); });
  if (mob_s) {
    mob_s.addEventListener('input', () => { if (se) { se.value=mob_s.value; PAGINATION_CONFIG.currentPage=1; renderProducts(); } });
    mob_s.addEventListener('keydown', e => {
      if (e.key==='Enter') {
        e.preventDefault();
        if (se) { se.value=mob_s.value; renderProducts(); }
        const nl = document.getElementById('navLinks');
        if (nl && nl.classList.contains('open')) toggleMobileMenu();
        document.getElementById('products').scrollIntoView({behavior:'instant'});
      }
    });
  }
  if (sb && st && se) {
    st.addEventListener('click', () => { const exp = sb.classList.toggle('expanded'); st.setAttribute('aria-expanded',exp); if (exp) se.focus(); });
    se.addEventListener('blur', () => { setTimeout(() => { sb.classList.remove('expanded'); st.setAttribute('aria-expanded','false'); }, 180); });
    se.addEventListener('keydown', e => { if (e.key==='Escape') { se.blur(); sb.classList.remove('expanded'); st.setAttribute('aria-expanded','false'); } });
  }
}

// ========================================
// MODAL
// ========================================
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  // Reset zoom al abrir
  ZOOM_CONFIG.currentZoom = 1;

  // Limpiar video previo si quedó abierto
  const mainWrap = document.getElementById('modalImgMain').parentElement;
  const oldVideo = mainWrap.querySelector('.modal-video-wrap');
  if (oldVideo) oldVideo.remove();
  const mainImgEl = document.getElementById('modalImgMain');
  mainImgEl.style.display = '';

  const mb    = document.getElementById('modalBody');
  const oldWm = mb.querySelector('.modal-watermark');
  if (oldWm) oldWm.remove();
  if (p.watermark) {
    const wm = document.createElement('img');
    wm.src = p.watermark;
    wm.className = 'modal-watermark';
    mb.appendChild(wm);
  }

  document.getElementById('modalTitulo').textContent = p.name;

  // Imagen principal
  const mainImg = document.getElementById('modalImgMain');
  mainImg.src = p.imgs[0];
  mainImg.removeAttribute('srcset');
  mainImg.removeAttribute('sizes');
  mainImg.alt = 'Imagen de ' + p.name;
  mainImg.style.transform = '';
  mainImg.style.cursor = 'zoom-in';
mainImg.onclick = (e) => { e.stopPropagation(); abrirLightbox(mainImg.src, p.name); };
// Zoom restringido a niveles discretos en lightbox

  // Flechas de navegación
  mainWrap.querySelectorAll('.modal-nav-arrow').forEach(a => a.remove());
  if (p.imgs.length > 1) {
    const arrowL = document.createElement('button');
    arrowL.className = 'modal-nav-arrow left';
    arrowL.innerHTML = '&#8249;';
    arrowL.setAttribute('aria-label', 'Imagen anterior');
    arrowL.onclick = (e) => { e.stopPropagation(); navegarGaleria(-1); };

    const arrowR = document.createElement('button');
    arrowR.className = 'modal-nav-arrow right';
    arrowR.innerHTML = '&#8250;';
    arrowR.setAttribute('aria-label', 'Imagen siguiente');
    arrowR.onclick = (e) => { e.stopPropagation(); navegarGaleria(1); };

    mainWrap.appendChild(arrowL);
    mainWrap.appendChild(arrowR);
  }

  // ── Thumbs: imágenes + video ──
  const thumbsEl  = document.getElementById('modalThumbs');
  const hasVideo  = !!p.video;
  const totalItems = p.imgs.length + (hasVideo ? 1 : 0);

  if (totalItems > 1) {
    const imgThumbs = p.imgs.map((img, i) => `
      <div class="modal-thumb ${i === 0 ? 'active' : ''}"
           onclick="cambiarImg('${img}', this)"
           role="tab"
           data-type="img"
           aria-label="Imagen ${i + 1} de ${p.imgs.length}">
      <img src="${img}" alt="Vista ${i + 1}" loading="lazy"/>
      </div>`).join('');

    const videoThumb = hasVideo ? (() => {
      const embed   = getVideoEmbed(p.video);
      const thumbBg = embed?.thumb
        ? `style="background-image:url('${embed.thumb}');background-size:cover;background-position:center;"`
        : '';
      return `
        <div class="modal-thumb modal-thumb-video"
             onclick="cambiarAVideo('${p.video}', this)"
             role="tab"
             data-type="video"
             ${thumbBg}
             aria-label="Ver video del producto">
          <span class="thumb-play-icon">▶</span>
        </div>`;
    })() : '';

    thumbsEl.innerHTML = imgThumbs + videoThumb;
    thumbsEl.style.display = 'flex';
  } else {
    thumbsEl.innerHTML = '';
    thumbsEl.style.display = 'none';
  }

  document.getElementById('modalInfo').innerHTML = `
    <span class="modal-badge">${escapeHtml(p.badge)}</span>
    <div class="modal-cat">${escapeHtml(p.cat)}</div>
    <div class="modal-name">${escapeHtml(p.name)}</div>
    <div class="modal-desc">${escapeHtml(p.desc)}</div>
    <table class="modal-tabla">${(p.specs||[]).map(([k,v])=>`<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(String(v||'-'))}</td></tr>`).join('')}</table>
    <div class="modal-apps"><h4>Aplicaciones</h4><ul>${(p.apps||[]).map(a=>`<li>${escapeHtml(a)}</li>`).join('')}</ul></div>
    ${p.doc ? `<button class="modal-pdf-btn" onclick="event.stopPropagation();abrirPDF('${p.doc}','${escapeAttr(p.name)}')">📄 Ver Ficha Técnica ${escapeHtml(p.name)}</button>` : ''}
    <a href="${WP}?text=${encodeURIComponent('Hola, me interesa el '+p.name+'. ¿Pueden darme información y precio?')}" target="_blank" rel="noopener noreferrer" class="modal-wp">${WP_SVG} Consultar por WhatsApp</a>`;

  openModal._currentImgIdx = 0;
  openModal._imgs          = p.imgs;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  openModal._prev = document.activeElement;

  const enfocables = document.getElementById('modal').querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  const first = enfocables[0], last = enfocables[enfocables.length - 1];

  function trap(e) {
    if (e.key === 'ArrowRight') { navegarGaleria(1); return; }
    if (e.key === 'ArrowLeft')  { navegarGaleria(-1); return; }
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }
  document.addEventListener('keydown', trap);
  openModal._trap = trap;
  if (first) first.focus();
}

// ========================================
// GALERÍA — navegación con flechas/teclado
// ========================================
function navegarGaleria(dir) {
  const imgs = openModal._imgs;
  if (!imgs || imgs.length <= 1) return;
  openModal._currentImgIdx = (openModal._currentImgIdx + dir + imgs.length) % imgs.length;
  const idx   = openModal._currentImgIdx;
  const thumb = document.querySelectorAll('.modal-thumb[data-type="img"]')[idx];
  if (thumb) cambiarImg(imgs[idx], thumb);
}

// ========================================
// CAMBIAR A VIDEO
// ========================================
function cambiarAVideo(url, el) {
  const embed = getVideoEmbed(url);
  if (!embed) return;

  const mainImg  = document.getElementById('modalImgMain');
  const mainWrap = mainImg.parentElement;

  // Ocultar flechas y imagen
  mainWrap.querySelectorAll('.modal-nav-arrow').forEach(a => a.style.display = 'none');
  mainImg.style.display = 'none';

  // Quitar video anterior si existe
  const old = mainWrap.querySelector('.modal-video-wrap');
  if (old) old.remove();

  const videoWrap = document.createElement('div');
  videoWrap.className = 'modal-video-wrap';

  if (embed.type === 'iframe') {
    videoWrap.innerHTML = `
      <iframe src="${embed.src}" frameborder="0" allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="Video del producto"></iframe>`;
  } else {
    videoWrap.innerHTML = `
      <video controls playsinline style="width:100%;height:100%;object-fit:contain;background:#000;">
        <source src="${embed.src}" type="video/mp4"/>
      </video>`;
  }

  mainWrap.appendChild(videoWrap);

  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ========================================
// CAMBIAR IMAGEN
// ========================================
function cambiarImg(src, el) {
  const mainImg  = document.getElementById('modalImgMain');
  const mainWrap = mainImg.parentElement;

  // Limpiar video si estaba activo
  const videoWrap = mainWrap.querySelector('.modal-video-wrap');
  if (videoWrap) videoWrap.remove();

  // Restaurar imagen y flechas
  mainImg.style.display = '';
  mainWrap.querySelectorAll('.modal-nav-arrow').forEach(a => a.style.display = '');

  // Reset zoom
  ZOOM_CONFIG.currentZoom = 1;
  mainImg.style.transform = 'scale(1)';
  mainImg.style.opacity   = '0';

  setTimeout(() => {
    mainImg.src           = src;
    mainImg.style.opacity = '1';
// mainImg.onclick = (e) => { e.stopPropagation(); abrirLightbox(src, ''); };
mainImg.onclick = null;
  }, 150);

  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const idx = Array.from(document.querySelectorAll('.modal-thumb[data-type="img"]')).indexOf(el);
  if (idx !== -1) openModal._currentImgIdx = idx;
}

function cerrarModal(e) { if (e.target === document.getElementById('modalOverlay')) cerrarModalBtn(); }

function cerrarModalBtn() {
  const mainWrap = document.getElementById('modalImgMain')?.parentElement;
  if (mainWrap) {
    const videoWrap = mainWrap.querySelector('.modal-video-wrap');
    if (videoWrap) videoWrap.remove();
    const mainImg = document.getElementById('modalImgMain');
    if (mainImg) mainImg.style.display = '';
  }
  if (openModal._trap) { document.removeEventListener('keydown', openModal._trap); openModal._trap = null; }
  if (openModal._prev) { openModal._prev.focus(); openModal._prev = null; }
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  ZOOM_CONFIG.currentZoom = 1;
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const lb = document.getElementById('lightboxOverlay');
  if (lb && lb.classList.contains('open')) { cerrarLightbox(); return; }
  const pdfO = document.getElementById('pdfOverlay');
  if (pdfO && pdfO.style.display === 'flex') cerrarPDF();
  else cerrarModalBtn();
});

// ========================================
// PDF
// ========================================
function abrirPDF(url, nombre) {
  let pdfO = document.getElementById('pdfOverlay');
  if (!pdfO) {
    pdfO = document.createElement('div');
    pdfO.id = 'pdfOverlay';
    pdfO.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(13,27,42,0.9);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:1rem';
    document.body.appendChild(pdfO);
  }
  const mob = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const src = mob ? 'https://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true' : url;
  pdfO.innerHTML = `<div style="width:100%;max-width:960px;display:flex;flex-direction:column;height:100%;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;margin-bottom:0.75rem;background:#fff;border:1px solid var(--borde);border-radius:10px;flex-shrink:0;gap:0.75rem;">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.95rem;font-weight:700;color:var(--titulo);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📄 ${escapeHtml(nombre)}</span>
      <button onclick="cerrarPDF()" style="width:36px;height:36px;border-radius:8px;border:1px solid var(--borde);background:transparent;color:var(--titulo);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;" aria-label="Cerrar">✕</button>
    </div>
    <iframe src="${src}" style="flex:1;width:100%;border:none;border-radius:10px;background:#fff;min-height:0;" title="Ficha Técnica ${escapeHtml(nombre)}"></iframe>
  </div>`;
  pdfO.style.display = 'flex';
}
function cerrarPDF() { const o = document.getElementById('pdfOverlay'); if (o) o.style.display = 'none'; }

// ========================================
// MENÚ MÓVIL
// ========================================
function toggleMobileMenu() {
  const h  = document.getElementById('navHamburger');
  const nl = document.getElementById('navLinks');
  const ov = document.getElementById('navMobileOverlay');
  if (!h || !nl) return;
  const open = h.classList.toggle('active');
  nl.classList.toggle('open');
  if (ov) ov.classList.toggle('open');
  h.setAttribute('aria-expanded', open);
}

// ========================================
// LIGHTBOX — zoom + paneo
// ========================================
const LBState = { scale: 1, x: 0, y: 0, dragging: false, lastX: 0, lastY: 0, pinchDist: 0, pinchScale: 1 };

function lbApply() {
  const img = document.getElementById('lbImg');
  if (img) img.style.transform = `translate(${LBState.x}px,${LBState.y}px) scale(${LBState.scale})`;
}

function lbReset() {
  LBState.scale = 1; LBState.x = 0; LBState.y = 0;
  const img = document.getElementById('lbImg');
  if (img) { img.style.transition = 'transform .3s ease'; lbApply(); setTimeout(()=>{ if(img) img.style.transition='none'; },320); }
}

function abrirLightbox(src, nombre) {
  let lb = document.getElementById('lightboxOverlay');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightboxOverlay';
    lb.innerHTML = `
      <button class="lb-close" onclick="cerrarLightbox()" aria-label="Cerrar">✕</button>
      <div class="lb-img-wrap" id="lbWrap">
        <img id="lbImg" src="" alt="" draggable="false"/>
      </div>
      <div class="lb-controls">
        <button class="lb-ctrl-btn" onclick="lbZoom(0.5)">＋</button>
        <button class="lb-ctrl-btn" onclick="lbZoom(-0.5)">－</button>
        <button class="lb-ctrl-btn" onclick="lbReset()">↺</button>
        <span class="lb-hint">Arrastra · Pellizca · Doble tap para resetear</span>
      </div>`;
    document.body.appendChild(lb);

    const wrap = document.getElementById('lbWrap');
    const img  = document.getElementById('lbImg');

    lb.addEventListener('click', e => { if (e.target === lb) cerrarLightbox(); });
    img.addEventListener('dblclick', lbReset);

    wrap.addEventListener('mousedown', e => {
      LBState.dragging = true; LBState.lastX = e.clientX; LBState.lastY = e.clientY;
      img.style.cursor = 'grabbing'; e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!LBState.dragging) return;
      LBState.x += e.clientX - LBState.lastX;
      LBState.y += e.clientY - LBState.lastY;
      LBState.lastX = e.clientX; LBState.lastY = e.clientY;
      lbApply();
    });
    window.addEventListener('mouseup', () => { LBState.dragging = false; img.style.cursor = 'grab'; });

    wrap.addEventListener('wheel', e => {
      e.preventDefault();
      lbZoom(e.deltaY < 0 ? 0.2 : -0.2);
    }, { passive: false });

    wrap.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        LBState.lastX = e.touches[0].clientX; LBState.lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        LBState.pinchDist  = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        LBState.pinchScale = LBState.scale;
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', e => {
      e.preventDefault();
      if (e.touches.length === 1) {
        LBState.x += e.touches[0].clientX - LBState.lastX;
        LBState.y += e.touches[0].clientY - LBState.lastY;
        LBState.lastX = e.touches[0].clientX; LBState.lastY = e.touches[0].clientY;
        lbApply();
      } else if (e.touches.length === 2) {
        const d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        LBState.scale = Math.max(0.8, Math.min(3, LBState.pinchScale * (d / LBState.pinchDist)));
        lbApply();
      }
    }, { passive: false });
  }

  LBState.scale = 1; LBState.x = 0; LBState.y = 0; LBState.dragging = false;
  const img = document.getElementById('lbImg');
  img.src = src; img.alt = nombre || '';
  img.style.transform = ''; img.style.transition = 'none'; img.style.cursor = 'grab';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function lbZoom(delta) {
  LBState.scale = Math.max(0.8, Math.min(3, LBState.scale + delta));
  lbApply();
}

function cerrarLightbox() {
  const lb = document.getElementById('lightboxOverlay');
  if (lb) { lb.classList.remove('open'); lbReset(); document.body.style.overflow = 'hidden'; }
}

// ========================================
// ENLACE ACTIVO
// ========================================
function initActiveMenuLink() {
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!secs.length || !links.length) return;
  function update() {
    const sp   = window.scrollY + 150;
    const hero = document.querySelector('.hero')?.offsetHeight || 600;
    if (sp < hero) { links.forEach(l => l.classList.remove('active')); return; }
    secs.forEach(s => {
      if (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight) {
        links.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + s.id) l.classList.add('active'); });
      }
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  document.body.setAttribute('data-theme', 'light');
  initCache();
  initIntroAudio();
  loadProducts();
  setupCatalogFilters();
  initActiveMenuLink();
  initZoomControls();

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});