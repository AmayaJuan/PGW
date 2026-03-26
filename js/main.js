/**
======================================================================
PA ACOUSTIC — main.js
TEMA CLARO PERMANENTE - Sin modo oscuro ni toggle
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
const ZOOM_CONFIG = { minZoom: 1, maxZoom: 3, currentZoom: 1 };

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
  if (img) { img.style.transform = 'scale(' + ZOOM_CONFIG.currentZoom + ')'; img.style.transition = 'transform 0.3s ease'; }
  document.querySelectorAll('.modal-thumb img').forEach(t => { t.style.transform = 'scale(' + ZOOM_CONFIG.currentZoom + ')'; t.style.transition = 'transform 0.3s ease'; });
}
function handleWheelZoom(e) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  const img = document.getElementById('modalImgMain');
  if (!img) return;
  const r = img.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
  e.preventDefault();
  if (e.deltaY < 0) zoomIn(); else zoomOut();
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    products = data.map(p => ({
      id: p.name.toLowerCase(),
      name: p.name.toUpperCase(),
      cat: p.category || "Parlantes",
      badge: "Producto",
      desc: p.description || "Producto de audio profesional",
      imgs: [p.images?.main || ""],
      watermark: p.images?.watermark || null,
      specs: p.specs ? Object.entries(p.specs).filter(([k]) => k !== 'aplicaciones') : [],
      apps: p.specs?.aplicaciones ? (typeof p.specs.aplicaciones === 'string' ? p.specs.aplicaciones.split(',').map(s => s.trim()) : p.specs.aplicaciones) : [],
      tags: [],
      doc: p.document || null
    }));
    renderBanner();
    renderProducts();
  } catch (e) { console.error("Error cargando products.json:", e); }
}

// ========================================
// BANNER
// ========================================
function onBannerItemClick(id) {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => openModal(id), 450);
}
function renderBanner() {
  const track = document.getElementById('bannerTrack');
  if (!track) return;
  const items = products.map(p => ({ src: p.imgs[0], alt: p.name, id: p.id }));
  const dup = [...items, ...items, ...items];
  track.innerHTML = dup.map(({ src, alt, id }) => `
    <div class="banner-item" onclick="onBannerItemClick('${id}')" role="button" tabindex="0">
      <img src="${src}" alt="${alt}" />
    </div>`).join('');
}

// ========================================
// FILTROS
// ========================================
function getProductSearchText(p) {
  return [p.name, p.cat, p.desc, (p.tags||[]).join(' '), (p.apps||[]).join(' ')].join(' ').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
function getFilteredproducts() {
  const se = document.getElementById('catalogSearch');
  const ce = document.getElementById('catalogCategory');
  const q = se?.value ? se.value.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') : '';
  const c = ce?.value ? ce.value.trim().toLowerCase() : '';
  let list = products;
  if (c) list = list.filter(p => (p.cat||'').toLowerCase() === c);
  if (q) list = list.filter(p => getProductSearchText(p).includes(q));
  return list;
}
function getUniqueCategories() {
  const fixed = ['Parlantes','Line Array','Woofer','Drivers','Cabinas'];
  const from = [];
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

function renderProducts() {
  const filtered = getFilteredproducts();
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const se = document.getElementById('catalogSearch');
  const ce = document.getElementById('catalogCategory');
  const query = se?.value ? se.value.trim() : '';
  const category = ce?.value ? ce.value.trim() : '';

  // Contador
  const pc = document.getElementById('productsCount');
  if (pc) {
    const total = filtered.length;
    const ip = PAGINATION_CONFIG.itemsPerPage;
    const cp = PAGINATION_CONFIG.currentPage;
    const start = Math.min(total, cp * ip);
    const end = cp * ip;
    if (total > 0) {
      pc.innerHTML = `<span class="count-label">Página</span><span class="count-current">${cp}</span><span class="count-range">${start}-${end}</span>${!category && !query ? `<span class="count-label">Total:</span><span class="categoria-badge" style="background:var(--rojo);color:#fff;padding:0.2rem 0.7rem;border-radius:20px;font-size:0.75rem;font-weight:600;">${total} productos</span>` : ''}`;
      pc.style.display = 'inline-flex';
    } else { pc.style.display = 'none'; }
  }

  // Categoría activa
  const ca = document.getElementById('categoryActive');
  const cn = document.getElementById('categoryName');
  if (ca && cn) {
    if (category) {
      const count = products.filter(p => (p.cat||'').toLowerCase() === category.toLowerCase()).length;
      cn.textContent = category + ' (' + count + ' productos)';
      ca.style.display = 'inline-flex';
    } else { ca.style.display = 'none'; }
  }

  // Sin resultados
  if (filtered.length === 0 && (query || category)) {
    grid.innerHTML = `<div class="catalog-empty" style="grid-column:1/-1;text-align:center;padding:3rem 2rem;background:var(--bg3);border:1px solid var(--borde);border-radius:12px;"><p style="font-size:1rem;color:var(--texto);margin-bottom:.5rem;">No hay productos con los filtros seleccionados.</p><p style="font-size:.85rem;color:var(--muted);">Cambia la categoría o el texto de búsqueda.</p></div>`;
    const pgc = document.getElementById('paginationControls');
    if (pgc) pgc.style.display = 'none';
    return;
  }

  const total = filtered.length;
  const ip = PAGINATION_CONFIG.itemsPerPage;
  const tp = Math.ceil(total / ip);
  if (PAGINATION_CONFIG.currentPage > tp) PAGINATION_CONFIG.currentPage = tp || 1;
  if (PAGINATION_CONFIG.currentPage < 1) PAGINATION_CONFIG.currentPage = 1;

  const start = (PAGINATION_CONFIG.currentPage - 1) * ip;
  const page = filtered.slice(start, start + ip);
  const grouped = {};
  page.forEach(p => { if (!grouped[p.cat]) grouped[p.cat] = []; grouped[p.cat].push(p); });

  let html = ''; let delay = 0;
  Object.keys(grouped).forEach((cat, i) => {
    if (i > 0) html += `<div class="prod-category-header"><span>${cat}</span></div>`;
    grouped[cat].forEach(p => {
      html += `<div class="prod-card" style="--card-delay:${delay*0.07}s" onclick="openModal('${p.id}')">
        <div class="prod-img-wrap">
          <img src="${p.imgs[0]}" alt="${p.name}"/>
          ${p.watermark ? `<img src="${p.watermark}" alt="" class="prod-watermark"/>` : ''}
          <span class="prod-badge">${escapeHtml(p.badge)}</span>
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
  const f = getFilteredproducts();
  const tp = Math.ceil(f.length / PAGINATION_CONFIG.itemsPerPage);
  if (page < 1 || page > tp) return;
  PAGINATION_CONFIG.currentPage = page;
  renderProducts();
  const sec = document.getElementById('products');
  if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupCatalogFilters() {
  fillCategorySelect();
  const se = document.getElementById('catalogSearch');
  const ce = document.getElementById('catalogCategory');
  const mob_c = document.getElementById('mobileMenuCategory');
  const mob_s = document.getElementById('mobileMenuSearch');
  const sb = document.getElementById('navSearchBox');
  const st = document.getElementById('navSearchTrigger');

  if (se) {
    se.addEventListener('input', () => { PAGINATION_CONFIG.currentPage = 1; renderProducts(); });
    se.addEventListener('keydown', e => { if (e.key==='Enter') { e.preventDefault(); renderProducts(); document.getElementById('products').scrollIntoView({behavior:'smooth'}); } });
  }
  if (ce) ce.addEventListener('change', () => { PAGINATION_CONFIG.currentPage=1; renderProducts(); document.getElementById('products').scrollIntoView({behavior:'smooth'}); });
  if (mob_c) mob_c.addEventListener('change', () => { if (ce) ce.value=mob_c.value; PAGINATION_CONFIG.currentPage=1; renderProducts(); document.getElementById('products').scrollIntoView({behavior:'smooth'}); });
  if (mob_s) {
    mob_s.addEventListener('input', () => { if (se) { se.value=mob_s.value; PAGINATION_CONFIG.currentPage=1; renderProducts(); } });
    mob_s.addEventListener('keydown', e => {
      if (e.key==='Enter') {
        e.preventDefault();
        if (se) { se.value=mob_s.value; renderProducts(); }
        const nl = document.getElementById('navLinks');
        if (nl && nl.classList.contains('open')) toggleMobileMenu();
        document.getElementById('products').scrollIntoView({behavior:'smooth'});
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

  const mb = document.getElementById('modalBody');
  const oldWm = mb.querySelector('.modal-watermark');
  if (oldWm) oldWm.remove();
  if (p.watermark) { const wm = document.createElement('img'); wm.src=p.watermark; wm.className='modal-watermark'; mb.appendChild(wm); }

  document.getElementById('modalTitulo').textContent = p.name;
  document.getElementById('modalImgMain').src = p.imgs[0];
  document.getElementById('modalImgMain').alt = 'Imagen de ' + p.name;
  document.getElementById('modalThumbs').innerHTML = p.imgs.map((img,i) => `<div class="modal-thumb ${i===0?'active':''}" onclick="cambiarImg('${img}',this)"><img src="${img}" alt=""/></div>`).join('');

  document.getElementById('modalInfo').innerHTML = `
    <span class="modal-badge">${p.badge}</span>
    <div class="modal-cat">${p.cat}</div>
    <div class="modal-name">${p.name}</div>
    <div class="modal-desc">${p.desc}</div>
    <table class="modal-tabla">${(p.specs||[]).map(([k,v])=>`<tr><td>${k}</td><td>${v||'-'}</td></tr>`).join('')}</table>
    <div class="modal-apps"><h4>Aplicaciones</h4><ul>${(p.apps||[]).map(a=>`<li>${a}</li>`).join('')}</ul></div>
    ${p.doc ? `<button class="modal-pdf-btn" onclick="event.stopPropagation();abrirPDF('${p.doc}','${p.name}')">📄 Ver Ficha Técnica ${escapeHtml(p.name)}</button>` : ''}
    <a href="${WP}?text=${encodeURIComponent('Hola, me interesa el '+p.name+'. ¿Pueden darme información y precio?')}" target="_blank" rel="noopener noreferrer" class="modal-wp">${WP_SVG} Consultar por WhatsApp</a>`;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  openModal._prev = document.activeElement;

  const enfocables = document.getElementById('modal').querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  const first = enfocables[0], last = enfocables[enfocables.length-1];
  function trap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement===first) { e.preventDefault(); last.focus(); } }
    else { if (document.activeElement===last) { e.preventDefault(); first.focus(); } }
  }
  document.addEventListener('keydown', trap);
  openModal._trap = trap;
  if (first) first.focus();
}

function cambiarImg(src, el) {
  document.getElementById('modalImgMain').src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function cerrarModal(e) { if (e.target===document.getElementById('modalOverlay')) cerrarModalBtn(); }
function cerrarModalBtn() {
  if (openModal._trap) { document.removeEventListener('keydown', openModal._trap); openModal._trap=null; }
  if (openModal._prev) { openModal._prev.focus(); openModal._prev=null; }
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const pdfO = document.getElementById('pdfOverlay');
  if (pdfO && pdfO.style.display==='flex') cerrarPDF();
  else cerrarModalBtn();
});

function abrirPDF(url, nombre) {
  let pdfO = document.getElementById('pdfOverlay');
  if (!pdfO) {
    pdfO = document.createElement('div');
    pdfO.id = 'pdfOverlay';
    pdfO.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(13,27,42,0.9);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:1rem';
    document.body.appendChild(pdfO);
  }
  const mob = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const src = mob ? 'https://docs.google.com/viewer?url='+encodeURIComponent(url)+'&embedded=true' : url;
  pdfO.innerHTML = `<div style="width:100%;max-width:960px;display:flex;flex-direction:column;height:100%;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;margin-bottom:0.75rem;background:#fff;border:1px solid var(--borde);border-radius:10px;flex-shrink:0;gap:0.75rem;">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.95rem;font-weight:700;color:var(--titulo);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📄 ${nombre}</span>
      <button onclick="cerrarPDF()" style="width:36px;height:36px;border-radius:8px;border:1px solid var(--borde);background:transparent;color:var(--titulo);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;" aria-label="Cerrar">✕</button>
    </div>
    <iframe src="${src}" style="flex:1;width:100%;border:none;border-radius:10px;background:#fff;min-height:0;" title="Ficha Técnica ${nombre}"></iframe>
  </div>`;
  pdfO.style.display = 'flex';
}
function cerrarPDF() { const o = document.getElementById('pdfOverlay'); if (o) o.style.display='none'; }

// ========================================
// MENÚ MÓVIL
// ========================================
function toggleMobileMenu() {
  const h = document.getElementById('navHamburger');
  const nl = document.getElementById('navLinks');
  const ov = document.getElementById('navMobileOverlay');
  if (!h || !nl) return;
  const open = h.classList.toggle('active');
  nl.classList.toggle('open');
  if (ov) ov.classList.toggle('open');
  h.setAttribute('aria-expanded', open);
}

// ========================================
// ENLACE ACTIVO
// ========================================
function initActiveMenuLink() {
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!secs.length || !links.length) return;
  function update() {
    const sp = window.scrollY + 150;
    const hero = document.querySelector('.hero')?.offsetHeight || 600;
    if (sp < hero) { links.forEach(l => l.classList.remove('active')); return; }
    secs.forEach(s => {
      if (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight) {
        links.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href')==='#'+s.id) l.classList.add('active'); });
      }
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Forzar tema claro siempre
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