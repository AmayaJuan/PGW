// ══════════════════════════════════════
//   SOUNDCRAFT — main.js
// ══════════════════════════════════════

// ── DATOS DE PRODUCTOS ──
// Para agregar un producto nuevo, copia uno de estos objetos y cambia los valores
const productos = [
  {
    id: 1,
    nombre: 'BassX Pro 500',
    cat: 'portable',
    precio: 389000,
    antes: 450000,       // null si no tiene precio anterior
    watts: '40W',
    desc: 'Potente parlante portátil resistente al agua IPX7 con 20h de batería.',
    badge: 'nuevo'       // 'nuevo' | 'oferta' | 'popular' | 'agotado' | null
  },
  {
    id: 2,
    nombre: 'TowerMax T800',
    cat: 'torre',
    precio: 1250000,
    antes: null,
    watts: '200W',
    desc: 'Sistema de torre de 2 vías con woofer de 12" y tweeter de titanio.',
    badge: 'popular'
  },
  {
    id: 3,
    nombre: 'StudioRef M65',
    cat: 'estudio',
    precio: 890000,
    antes: 980000,
    watts: '65W',
    desc: 'Monitor de estudio plano de referencia para producción profesional.',
    badge: 'oferta'
  },
  {
    id: 4,
    nombre: 'CineBar S200',
    cat: 'cine',
    precio: 2100000,
    antes: null,
    watts: '320W',
    desc: 'Soundbar 3.1 con subwoofer inalámbrico y Dolby Atmos.',
    badge: 'nuevo'
  },
  {
    id: 5,
    nombre: 'TrailBlaze X',
    cat: 'outdoor',
    precio: 520000,
    antes: null,
    watts: '60W',
    desc: 'Parlante outdoor con panel solar y batería de 30h para aventuras.',
    badge: 'popular'
  },
  {
    id: 6,
    nombre: 'TowerMax T1200',
    cat: 'torre',
    precio: 2800000,
    antes: 3100000,
    watts: '400W',
    desc: 'Torre flagship con amplificador clase D y respuesta 20Hz–20kHz.',
    badge: 'oferta'
  },
  {
    id: 7,
    nombre: 'MiniPod BT',
    cat: 'portable',
    precio: 185000,
    antes: null,
    watts: '15W',
    desc: 'Diseño compacto 360° con graves sorprendentes para su tamaño.',
    badge: null
  },
  {
    id: 8,
    nombre: 'StudioRef M80',
    cat: 'estudio',
    precio: 1350000,
    antes: null,
    watts: '80W',
    desc: 'Monitor de campo cercano con corrección de sala DSP integrada.',
    badge: 'popular'
  },
  {
    id: 9,
    nombre: 'CineSub 12"',
    cat: 'cine',
    precio: 980000,
    antes: null,
    watts: '250W',
    desc: 'Subwoofer de 12" con amplificador digital y ajuste de frecuencia de corte.',
    badge: null
  },
  {
    id: 10,
    nombre: 'BoomField X3',
    cat: 'outdoor',
    precio: 750000,
    antes: 820000,
    watts: '100W',
    desc: 'Sistema PA portátil con micrófono inalámbrico incluido.',
    badge: 'oferta'
  },
  {
    id: 11,
    nombre: 'TowerMax T500',
    cat: 'torre',
    precio: 680000,
    antes: null,
    watts: '120W',
    desc: 'Torre compacta ideal para salas medianas y ambientes corporativos.',
    badge: null
  },
  {
    id: 12,
    nombre: 'CineBar Ultra 5.1',
    cat: 'cine',
    precio: 3500000,
    antes: null,
    watts: '500W',
    desc: 'Sistema surround 5.1 completo con subwoofer activo y altavoces satélite.',
    badge: 'nuevo'
  },
];

// ── NÚMERO DE WHATSAPP ──
// Cambia este número por el de tu empresa (formato internacional sin + ni espacios)
const WHATSAPP = '573046272826';

// ══════════════════════════════════════
//   FUNCIONES
// ══════════════════════════════════════

// Genera el ícono SVG del parlante según la categoría
function speakerSVG(cat) {
  const colores = {
    portable: '#3b82f6',
    torre:    '#ff6b2b',
    estudio:  '#22c55e',
    cine:     '#eab308',
    outdoor:  '#06b6d4'
  };
  const c = colores[cat] || '#ff6b2b';

  return `
    <svg class="spk-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="60" height="80" rx="10" fill="#1e2633" stroke="${c}" stroke-width="1.5"/>
      <circle cx="50" cy="45" r="22" fill="#0f1218" stroke="${c}" stroke-width="2"/>
      <circle cx="50" cy="45" r="14" fill="#161b24" stroke="${c}33" stroke-width="1"/>
      <circle cx="50" cy="45" r="6" fill="${c}" opacity="0.9"/>
      <circle cx="50" cy="72" r="5" fill="#0f1218" stroke="${c}" stroke-width="1.5"/>
      <circle cx="50" cy="72" r="2" fill="${c}" opacity="0.7"/>
      <rect x="32" y="20" width="8" height="3" rx="1.5" fill="${c}" opacity="0.4"/>
      <rect x="43" y="20" width="8" height="3" rx="1.5" fill="${c}" opacity="0.4"/>
      <rect x="54" y="20" width="8" height="3" rx="1.5" fill="${c}" opacity="0.4"/>
    </svg>`;
}

// Formatea el precio en pesos colombianos
function formatPrecio(n) {
  return '$' + n.toLocaleString('es-CO');
}

// Dibuja las tarjetas de productos en el grid
function renderProductos(lista) {
  const grid = document.getElementById('productosGrid');
  document.getElementById('conteo').textContent = lista.length;

  grid.innerHTML = lista.map((p, i) => `
    <div class="producto-card cat-${p.cat}" style="animation-delay:${i * 0.06}s">
      <div class="card-img">
        ${speakerSVG(p.cat)}
        ${p.badge ? `<span class="card-badge badge-${p.badge}">${p.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-cat">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</div>
        <div class="card-name">${p.nombre}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-specs">
          <span class="spec-tag">${p.watts}</span>
          <span class="spec-tag">Bluetooth</span>
          <span class="spec-tag">Garantía 2Y</span>
        </div>
        <div class="card-footer">
          <div>
            ${p.antes ? `<span class="precio-antes">${formatPrecio(p.antes)}</span>` : ''}
            <span class="card-precio">
              <span class="moneda">COP</span>${formatPrecio(p.precio).replace('$', '')}
            </span>
          </div>
          <button
            class="card-btn"
            ${p.badge === 'agotado' ? 'disabled' : ''}
            onclick="cotizar('${p.nombre}')">
            ${p.badge === 'agotado' ? 'Agotado' : 'Cotizar'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filtra los productos por categoría
function filtrar(cat, btn) {
  // Quitar clase active de todos los botones
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const lista = cat === 'todos' ? productos : productos.filter(p => p.cat === cat);
  renderProductos(lista);
}

// Abre WhatsApp con el nombre del producto
function cotizar(nombre) {
  const msg = encodeURIComponent(`Hola, me interesa cotizar el ${nombre}. ¿Cuál es el precio y disponibilidad?`);
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
}

// Maneja el envío del formulario de contacto
function enviarForm(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

// ══════════════════════════════════════
//   SCROLL REVEAL
// ══════════════════════════════════════
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ══════════════════════════════════════
//   INICIO
// ══════════════════════════════════════
renderProductos(productos);
