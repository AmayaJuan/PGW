/**
 * Prueba de panel “admin”: login fijo + productos guardados en localStorage.
 * GitHub Pages no puede escribir el repo desde el navegador: los cambios son
 * locales a este equipo/navegador salvo que exportes el JSON y lo subas a Git.
 */
(function () {
  const LS_PRODUCTS = 'pacoustic_local_products';
  const SK_ADMIN = 'pacoustic_admin_demo_session';
  const DEMO_USER = 'pacoustic';
  const DEMO_PASS = 'catalogo-demo';
  const URL_FLAG = 'demoAdmin';
  const LS_GH_META = 'pacoustic_github_meta';
  const SS_GH_PAT = 'pacoustic_github_pat';

  function readLocalProducts() {
    try {
      const j = JSON.parse(localStorage.getItem(LS_PRODUCTS) || '[]');
      return Array.isArray(j) ? j : [];
    } catch (_) {
      return [];
    }
  }

  function writeLocalProducts(arr) {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(arr));
  }

  function isAdminSession() {
    return sessionStorage.getItem(SK_ADMIN) === '1';
  }

  function setAdminSession(on) {
    if (on) sessionStorage.setItem(SK_ADMIN, '1');
    else sessionStorage.removeItem(SK_ADMIN);
  }

  function wantsDemoUi() {
    try {
      const sp = new URLSearchParams(window.location.search || '');
      if (sp.has(URL_FLAG)) {
        const raw = sp.get(URL_FLAG);
        const v = (raw == null || raw === '' ? '1' : String(raw)).toLowerCase().trim();
        return v === '1' || v === 'true' || v === 'yes' || v === 'on';
      }
      const h = (window.location.hash || '').replace(/^#/, '').toLowerCase();
      if (h === 'demoadmin' || h === 'demo-admin') return true;
      return false;
    } catch (_) {
      return false;
    }
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function loadGhMeta() {
    try {
      const j = JSON.parse(localStorage.getItem(LS_GH_META) || '{}');
      return j && typeof j === 'object' ? j : {};
    } catch (_) {
      return {};
    }
  }

  function saveGhMeta(partial) {
    const cur = loadGhMeta();
    const next = { ...cur, ...partial };
    localStorage.setItem(LS_GH_META, JSON.stringify(next));
  }

  function getMergedCatalogForExport() {
    const base = Array.isArray(window.__PACOUSTIC_CATALOG_JSON_BASE)
      ? window.__PACOUSTIC_CATALOG_JSON_BASE.slice()
      : [];
    const extra = readLocalProducts();
    return base.concat(extra);
  }

  function parseSpecsBlock(text) {
    const specs = {};
    const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let aplicaciones = '';
    for (const line of lines) {
      const m = line.match(/^([^:]+):\s*(.*)$/);
      if (!m) continue;
      const k = m[1].trim();
      const v = m[2].trim();
      if (/^aplicaciones$/i.test(k)) aplicaciones = v;
      else specs[k] = v;
    }
    if (aplicaciones) specs.aplicaciones = aplicaciones;
    return specs;
  }

  function buildProductFromForm(get) {
    const name = (get('f-name') || '').trim();
    if (!name) throw new Error('El nombre es obligatorio.');
    const main = (get('f-main') || '').trim();
    if (!main) throw new Error('La URL de imagen principal es obligatoria.');
    const galleryRaw = (get('f-gallery') || '').trim();
    const gallery = galleryRaw
      ? galleryRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).filter(u => u !== main)
      : [];
    let idNum = parseInt(get('f-id'), 10);
    if (!Number.isFinite(idNum) || idNum < 1) {
      const base = window.__PACOUSTIC_CATALOG_JSON_BASE;
      const local = readLocalProducts();
      const all = [...(Array.isArray(base) ? base : []), ...local];
      const maxId = all.reduce((m, p) => {
        const n = typeof p.id === 'number' ? p.id : parseInt(String(p.id), 10);
        return Number.isFinite(n) && n > m ? n : m;
      }, 0);
      idNum = Math.max(90001, maxId + 1);
    }
    const obj = {
      id: idNum,
      name,
      category: (get('f-cat') || '').trim() || 'Parlantes',
      subcategory: (get('f-sub') || '').trim(),
      description: (get('f-desc') || '').trim() || 'Producto de audio profesional',
      images: { main, gallery },
    };
    const banner = (get('f-banner') || '').trim();
    if (banner) obj.bannerImg = banner;
    const doc = (get('f-doc') || '').trim();
    if (doc) obj.document = doc;
    const vid = (get('f-video') || '').trim();
    if (vid) obj.video = vid;
    const specsText = get('f-specs') || '';
    const specs = parseSpecsBlock(specsText);
    if (Object.keys(specs).length) obj.specs = specs;
    return obj;
  }

  function renderPanel(root, state) {
    const logged = isAdminSession();
    let html = '';
    html += '<div class="pac-admin-demo-head">';
    html += '<h2>Prueba de catálogo (local)</h2>';
    html += '<button type="button" class="pac-admin-demo-close" data-act="close" aria-label="Cerrar">✕</button>';
    html += '</div><div class="pac-admin-demo-body">';

    html += '<p class="pac-admin-demo-note"><strong>Importante:</strong> «Añadir producto» guarda en <strong>localStorage</strong> (solo este navegador). Para subir el catálogo al repositorio usa la sección <strong>Publicar en GitHub</strong> (token de acceso). GitHub <strong>no acepta</strong> la contraseña de la cuenta para la API. El login <code>pacoustic</code> / <code>catalogo-demo</code> es solo para abrir este panel de prueba.</p>';

    if (!logged) {
      html += '<div class="pac-admin-demo-field"><label for="pac-ad-user">Usuario</label><input id="pac-ad-user" autocomplete="username" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="pac-ad-pass">Contraseña</label><input id="pac-ad-pass" type="password" autocomplete="current-password" /></div>';
      html += '<p class="pac-admin-demo-note" style="margin:0">Credenciales de prueba: <strong>' + esc(DEMO_USER) + '</strong> / <strong>' + esc(DEMO_PASS) + '</strong></p>';
      html += '<div class="pac-admin-demo-actions"><button type="button" class="pac-admin-demo-btn pac-admin-demo-btn--primary" data-act="login">Entrar</button></div>';
    } else {
      html += '<div class="pac-admin-demo-field"><label for="f-id">ID numérico (opcional)</label><input id="f-id" placeholder="Auto si lo dejas vacío" inputmode="numeric" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-name">Nombre del producto</label><input id="f-name" required placeholder="Ej. PA HL-99A" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-cat">Categoría</label><input id="f-cat" placeholder="Cabinas, Woofer, Drivers…" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-sub">Subcategoría</label><input id="f-sub" placeholder="Line Array, Neodimio…" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-desc">Descripción</label><textarea id="f-desc" placeholder="Texto largo del producto"></textarea></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-main">URL imagen principal</label><input id="f-main" placeholder="https://…" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-gallery">URLs galería (una por línea)</label><textarea id="f-gallery" placeholder="https://foto2…"></textarea></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-banner">URL banner carrusel (opcional)</label><input id="f-banner" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-video">URL video (opcional)</label><input id="f-video" placeholder="YouTube o mp4 / Cloudinary" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-doc">URL ficha PDF (opcional)</label><input id="f-doc" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="f-specs">Especificaciones (una por línea: <code>Clave: valor</code>). Usa la línea <code>aplicaciones: …</code> para aplicaciones.</label><textarea id="f-specs" placeholder="Potencia RMS: 500 W&#10;aplicaciones: Eventos, iglesias"></textarea></div>';
      html += '<div id="pac-ad-msg"></div>';
      html += '<div class="pac-admin-demo-actions">';
      html += '<button type="button" class="pac-admin-demo-btn pac-admin-demo-btn--primary" data-act="add">Añadir producto</button>';
      html += '<button type="button" class="pac-admin-demo-btn" data-act="export">Descargar JSON (products-export.json)</button>';
      html += '<button type="button" class="pac-admin-demo-btn" data-act="save-fs" id="pac-ad-save-fs">Elegir archivo y guardar…</button>';
      html += '<button type="button" class="pac-admin-demo-btn" data-act="logout">Salir</button>';
      html += '</div>';

      const locals = readLocalProducts();
      html += '<div class="pac-admin-demo-list"><strong>Productos solo en este navegador</strong> (' + locals.length + ')';
      if (locals.length) {
        html += '<ul>';
        locals.forEach((p, i) => {
          const label = esc(p.name || '(sin nombre)');
          html += '<li><span>' + label + '</span><button type="button" class="pac-admin-demo-btn pac-admin-demo-btn--danger" data-act="del" data-i="' + i + '">Quitar</button></li>';
        });
        html += '</ul>';
      }
      html += '</div>';

      html += '<h3 class="pac-admin-demo-subtit">Deshacer cambios locales</h3>';
      html +=
        '<p class="pac-admin-demo-note">Si no te gustó cómo quedó la prueba <strong>en este navegador</strong>, borra los productos añadidos aquí: el catálogo vuelve a coincidir con el <code>data/products.json</code> del sitio (sin tocar Git hasta que subas algo). Si ya hiciste <strong>push</strong> a GitHub y quieres deshacerlo, usa el historial del repositorio en GitHub (esta página no puede borrar commits).</p>';
      html += '<div class="pac-admin-demo-actions">';
      html +=
        '<button type="button" class="pac-admin-demo-btn pac-admin-demo-btn--danger" data-act="clear-all-local">Borrar todos los productos de prueba del navegador</button>';
      html +=
        '<button type="button" class="pac-admin-demo-btn" data-act="clear-gh-stored">Olvidar repo guardado y token (esta pestaña)</button>';
      html += '</div>';

      const gh = loadGhMeta();
      let go = escAttr(gh.owner || '');
      let gr = escAttr(gh.repo || '');
      if (/github\.com\//i.test(String(gh.owner || ''))) {
        const m = String(gh.owner + ' ' + gh.repo).match(/github\.com\/([^/\s?#]+)\/([^/\s?#]+)/i);
        if (m) {
          go = escAttr(m[1]);
          gr = escAttr(m[2]);
        }
      }
      const gb = escAttr(gh.branch || 'main');
      const gp = escAttr(gh.path || 'data/products.json');
      html += '<hr class="pac-admin-demo-hr" />';
      html += '<h3 class="pac-admin-demo-subtit">Publicar en GitHub (commit en el repo)</h3>';
      html +=
        '<p class="pac-admin-demo-note">Crea un <strong>Personal Access Token</strong> en GitHub. <strong>Classic:</strong> scope <code>repo</code> (repo privado) o <code>public_repo</code> (público). <strong>Fine-grained:</strong> recurso «Only select repositories» y elige <strong>este</strong> repo; permiso <strong>Contents → Read and write</strong> (si está solo lectura, sale «Resource not accessible…»). Org con SSO: en la lista de tokens, «Configure» al lado del token. <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">github.com/settings/tokens</a></p>';
      html +=
        '<div class="pac-admin-demo-field"><label for="gh-owner">Propietario del repo (usuario u organización)</label><input id="gh-owner" value="' + go + '" autocomplete="organization" placeholder="Ej. AmayaJuan (no pegues https://…)" /></div>';
      html +=
        '<div class="pac-admin-demo-field"><label for="gh-repo">Nombre del repositorio</label><input id="gh-repo" value="' + gr + '" autocomplete="off" placeholder="Ej. Pacoustic" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="gh-branch">Rama</label><input id="gh-branch" value="' + gb + '" autocomplete="off" /></div>';
      html +=
        '<div class="pac-admin-demo-field"><label for="gh-path">Ruta del JSON dentro del repo</label><input id="gh-path" value="' + gp + '" autocomplete="off" placeholder="data/products.json o Pacoustic/data/products.json" /></div>';
      html += '<div class="pac-admin-demo-field"><label for="gh-token">Token (PAT)</label><input id="gh-token" type="password" autocomplete="off" placeholder="ghp_… o fine-grained" /></div>';
      html +=
        '<label class="pac-admin-demo-check"><input type="checkbox" id="gh-remember-pat" /> Recordar token solo en esta pestaña (sessionStorage)</label>';
      html += '<div id="pac-ad-gh-msg"></div>';
      html +=
        '<div class="pac-admin-demo-actions"><button type="button" class="pac-admin-demo-btn pac-admin-demo-btn--primary" data-act="gh-push">Subir catálogo a GitHub</button></div>';
    }
    html += '</div>';
    root.innerHTML = html;

    if (logged) {
      const tokEl = root.querySelector('#gh-token');
      if (tokEl && sessionStorage.getItem(SS_GH_PAT)) tokEl.value = sessionStorage.getItem(SS_GH_PAT);
      const rem = root.querySelector('#gh-remember-pat');
      if (rem) rem.checked = !!sessionStorage.getItem(SS_GH_PAT);
    }

    root.querySelector('[data-act="close"]')?.addEventListener('click', () => closeModal());

    root.querySelector('[data-act="login"]')?.addEventListener('click', () => {
      const u = root.querySelector('#pac-ad-user')?.value?.trim();
      const p = root.querySelector('#pac-ad-pass')?.value || '';
      if (u === DEMO_USER && p === DEMO_PASS) {
        setAdminSession(true);
        renderPanel(root, state);
        try {
          if (typeof window.PAcousticRefreshCatalogUi === 'function') window.PAcousticRefreshCatalogUi();
        } catch (_) {}
      } else {
        let err = root.querySelector('.pac-admin-demo-msg--err');
        if (!err) {
          err = document.createElement('p');
          err.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          root.querySelector('.pac-admin-demo-body')?.prepend(err);
        }
        err.textContent = 'Usuario o contraseña incorrectos.';
      }
    });

    root.querySelector('[data-act="logout"]')?.addEventListener('click', () => {
      setAdminSession(false);
      try {
        sessionStorage.removeItem(SS_GH_PAT);
      } catch (_) {}
      try {
        if (typeof window.PAcousticRefreshCatalogUi === 'function') window.PAcousticRefreshCatalogUi();
      } catch (_) {}
      renderPanel(root, state);
    });

    root.querySelector('[data-act="add"]')?.addEventListener('click', () => {
      const msg = root.querySelector('#pac-ad-msg');
      const get = id => root.querySelector('#' + id)?.value;
      try {
        const obj = buildProductFromForm(get);
        const arr = readLocalProducts();
        arr.push(obj);
        writeLocalProducts(arr);
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--ok';
          msg.textContent =
            'Guardado en este navegador (no modifica data/products.json en el disco/Git). Recargando catálogo…';
        }
        setTimeout(() => window.location.reload(), 400);
      } catch (e) {
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          msg.textContent = e.message || 'Error al guardar.';
        }
      }
    });

    root.querySelector('[data-act="export"]')?.addEventListener('click', () => {
      const full = getMergedCatalogForExport();
      const blob = new Blob([JSON.stringify(full, null, 2)], { type: 'application/json;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'products-export.json';
      a.click();
      URL.revokeObjectURL(a.href);
      const msg = root.querySelector('#pac-ad-msg');
      if (msg) {
        msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--ok';
        msg.textContent =
          'Descarga lista. Renombra a products.json (o fusiona a mano) y súbelo a data/ en Git con commit/push.';
      }
    });

    const fsBtn = root.querySelector('[data-act="save-fs"]');
    if (fsBtn && !('showSaveFilePicker' in window)) {
      fsBtn.disabled = true;
      fsBtn.title = 'No disponible en este navegador; usa «Descargar JSON» y copia el archivo.';
    }
    root.querySelector('[data-act="save-fs"]')?.addEventListener('click', async () => {
      const msg = root.querySelector('#pac-ad-msg');
      if (!('showSaveFilePicker' in window)) {
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          msg.textContent = 'Tu navegador no soporta guardar en un archivo desde aquí. Usa «Descargar JSON».';
        }
        return;
      }
      try {
        const full = getMergedCatalogForExport();
        const text = JSON.stringify(full, null, 2);
        const handle = await window.showSaveFilePicker({
          suggestedName: 'products.json',
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(text);
        await writable.close();
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--ok';
          msg.textContent =
            'Archivo guardado. Si guardaste en data/products.json del proyecto, recarga la página (y sube cambios a Git para GitHub Pages).';
        }
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          msg.textContent = (e && e.message) || 'No se pudo guardar el archivo.';
        }
      }
    });

    root.querySelectorAll('[data-act="del"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-i'), 10);
        const arr = readLocalProducts();
        if (i >= 0 && i < arr.length) {
          arr.splice(i, 1);
          writeLocalProducts(arr);
          window.location.reload();
        }
      });
    });

    root.querySelector('[data-act="clear-all-local"]')?.addEventListener('click', () => {
      const n = readLocalProducts().length;
      if (n === 0) {
        const msg = root.querySelector('#pac-ad-msg');
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          msg.textContent = 'No hay productos de prueba guardados en este navegador.';
        }
        return;
      }
      const ok = window.confirm(
        '¿Borrar todos los productos añadidos solo en este navegador (' +
          n +
          ')? El catálogo volverá al JSON publicado en el sitio.'
      );
      if (!ok) return;
      try {
        localStorage.removeItem(LS_PRODUCTS);
      } catch (_) {}
      window.location.reload();
    });

    root.querySelector('[data-act="clear-gh-stored"]')?.addEventListener('click', () => {
      const ok = window.confirm(
        '¿Borrar el propietario/repo/rama/ruta guardados y el token de esta pestaña? No elimina commits ya hechos en GitHub.'
      );
      if (!ok) return;
      try {
        localStorage.removeItem(LS_GH_META);
      } catch (_) {}
      try {
        sessionStorage.removeItem(SS_GH_PAT);
      } catch (_) {}
      renderPanel(root, state);
      const msg = root.querySelector('#pac-ad-msg');
      if (msg) {
        msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--ok';
        msg.textContent = 'Datos de GitHub guardados en el navegador eliminados.';
      }
    });

    root.querySelector('[data-act="gh-push"]')?.addEventListener('click', async () => {
      const msg = root.querySelector('#pac-ad-gh-msg');
      const pub = globalThis.PAcousticGithubPublish;
      if (!pub || typeof pub.putProductsJson !== 'function') {
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          msg.textContent = 'Falta el script githubCatalogPublish.js en la página.';
        }
        return;
      }
      const owner = root.querySelector('#gh-owner')?.value?.trim() || '';
      const repo = root.querySelector('#gh-repo')?.value?.trim() || '';
      const branch = root.querySelector('#gh-branch')?.value?.trim() || 'main';
      const path = root.querySelector('#gh-path')?.value?.trim() || 'data/products.json';
      let token = root.querySelector('#gh-token')?.value?.trim() || '';
      const remember = !!root.querySelector('#gh-remember-pat')?.checked;
      if (!token) token = (sessionStorage.getItem(SS_GH_PAT) || '').trim();
      saveGhMeta({ owner, repo, branch, path });
      if (remember && token) {
        try {
          sessionStorage.setItem(SS_GH_PAT, token);
        } catch (_) {}
      } else {
        try {
          sessionStorage.removeItem(SS_GH_PAT);
        } catch (_) {}
      }
      if (msg) {
        msg.className = 'pac-admin-demo-msg';
        msg.textContent = 'Subiendo…';
      }
      try {
        const full = getMergedCatalogForExport();
        const jsonText = JSON.stringify(full, null, 2);
        await pub.putProductsJson({ owner, repo, branch, path, token, jsonText });
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--ok';
          msg.textContent =
            'Listo: commit en GitHub. Espera unos segundos y recarga el sitio (Pages puede cachear; si no ves cambios, sube CATALOG_JSON_VERSION en main.js).';
        }
      } catch (e) {
        if (msg) {
          msg.className = 'pac-admin-demo-msg pac-admin-demo-msg--err';
          msg.textContent = e.message || 'Error al publicar en GitHub.';
        }
      }
    });
  }

  let backdropEl = null;

  function openModal() {
    if (backdropEl) return;
    backdropEl = document.createElement('div');
    backdropEl.className = 'pac-admin-demo-backdrop';
    backdropEl.setAttribute('role', 'dialog');
    backdropEl.setAttribute('aria-modal', 'true');
    backdropEl.setAttribute('aria-label', 'Prueba de catálogo');
    const panel = document.createElement('div');
    panel.className = 'pac-admin-demo-panel';
    backdropEl.appendChild(panel);
    document.body.appendChild(backdropEl);
    renderPanel(panel, {});
    backdropEl.addEventListener('click', e => {
      if (e.target === backdropEl) closeModal();
    });
    document.addEventListener('keydown', onKey);
  }

  function closeModal() {
    document.removeEventListener('keydown', onKey);
    if (backdropEl) {
      backdropEl.remove();
      backdropEl = null;
    }
  }

  function onKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  function injectLauncher() {
    if (!wantsDemoUi() && !isAdminSession()) {
      document.getElementById('pacAdminDemoBar')?.remove();
      document.getElementById('pacAdminDemoLauncher')?.remove();
      return;
    }
    if (document.getElementById('pacAdminDemoBar')) return;

    const bar = document.createElement('div');
    bar.id = 'pacAdminDemoBar';
    bar.className = 'pac-admin-demo-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Modo prueba de catálogo');
    bar.innerHTML =
      '<span class="pac-admin-demo-bar-text">Modo prueba: añadir productos solo en <strong>este navegador</strong>. No es acceso seguro.</span>' +
      '<button type="button" class="pac-admin-demo-bar-btn" id="pacAdminDemoOpenBtn">' +
      (isAdminSession() ? 'Abrir panel' : 'Abrir panel (login)') +
      '</button>';
    document.body.appendChild(bar);
    bar.querySelector('#pacAdminDemoOpenBtn')?.addEventListener('click', () => openModal());

    if (document.getElementById('pacAdminDemoLauncher')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'pacAdminDemoLauncher';
    b.className = 'pac-admin-demo-launcher';
    b.textContent = isAdminSession() ? 'Panel' : 'Panel prueba';
    b.setAttribute('title', 'Abrir panel de prueba del catálogo');
    b.addEventListener('click', () => openModal());
    document.body.appendChild(b);
  }

  function init() {
    injectLauncher();
  }

  function boot() {
    init();
    window.addEventListener('hashchange', () => injectLauncher());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
