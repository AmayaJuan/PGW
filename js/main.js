// ══════════════════════════════════════
//   PA ACOUSTIC — main.js
// ══════════════════════════════════════

const WP = 'https://wa.me/573053402732';

const WP_SVG = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// ── PRODUCTOS ──
// Para agregar un producto: copia un objeto, cambia los datos e imágenes
const productos = [
  {
    id: 'hl30a',
    nombre: 'PA HL-30A',
    cat: 'Line Array Activo',
    badge: 'Top',
    desc: 'Sistema line array activo bi-amplificado de 2 vías. 2200W totales, 1100W RMS, SPL 137dB, rango 50Hz–20kHz. DSP 32 bits integrado.',
    imgs: ['img/hl30a-1.png'],
    watermark: 'img/hl30a-watermark.png',
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
      ['Frecuencia',         '50 Hz – 3500 Hz'],
      ['Bobina',             '3 pulgadas'],
      ['Capas',              '2 capas (IN - OUT)'],
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

// ── RENDER TARJETAS ──
function renderProductos() {
  document.getElementById('productosGrid').innerHTML = productos.map((p, i) => `
    <div class="prod-card" style="opacity:0;animation:fadeUp .6s ease forwards ${i * 0.07}s" onclick="abrirModal('${p.id}')">
      <div class="prod-img-wrap">
        <img src="${p.imgs[0]}" alt="${p.nombre}"/>
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
  `).join('');
}

// ── MODAL ──
function abrirModal(id) {
  const p = productos.find(x => x.id === id);
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

  document.getElementById('modalTitulo').textContent = p.nombre;
  document.getElementById('modalImgMain').src = p.imgs[0];

  document.getElementById('modalThumbs').innerHTML = p.imgs.map((img, i) => `
    <div class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="cambiarImg('${img}', this)">
      <img src="${img}" alt=""/>
    </div>
  `).join('');

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

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cambiarImg(src, el) {
  document.getElementById('modalImgMain').src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function cerrarModal(e) {
  if (e.target === document.getElementById('modalOverlay')) cerrarModalBtn();
}

function cerrarModalBtn() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModalBtn(); });

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── INICIO ──
renderProductos();
