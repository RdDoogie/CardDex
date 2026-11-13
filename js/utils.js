/* ==================================================================
   CardDex · utils.js
   Utilidades compartidas por todas las páginas:
   selectores, formatos, iconos SVG, imágenes de cartas con fallback
   y toasts. (Scripts clásicos, no módulos, para que funcione con
   doble clic: las constantes de este archivo son globales.)
   ================================================================== */

/* ---------- Selectores cortos ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Preferencias del usuario ---------- */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // menos animaciones
const DESKTOP = window.matchMedia('(min-width: 768px)');                      // mismo corte que "md:"

/* Espera (más corta si se reducen animaciones) */
const wait = ms => new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 150) : ms));

/* ---------- Formatos ---------- */
// Euros estilo español: 4320 -> "4.320 €"
const fmtEUR = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
// Porcentaje: 4.17 -> "+4,2 %"
const fmtPct = n => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1).replace('.', ',') + ' %';

/* Busca una carta de la colección por id */
const getCard = id => DATA.cards.find(c => c.id === id);

/* ---------- Iconos SVG inline (estilo línea, 24x24) ---------- */
const ICONS = {
  chevronDown:  '<path d="m6 9 6 6 6-6"/>',
  chevronLeft:  '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  refresh:  '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
  shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  trash:    '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>',
  check:    '<path d="M20 6 9 17l-5-5"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 10.5l-6.1 1.7L12 18l-1.9-5.8L4 10.5l6.1-1.7z"/><path d="M19 17v4M17 19h4"/>',
  card:     '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h3"/>',
  grid:     '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  scan:     '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  merge:    '<rect x="2.5" y="5" width="7.5" height="14" rx="1.5"/><rect x="14" y="5" width="7.5" height="14" rx="1.5"/><path d="M10 12h4"/>',
  trendUp:  '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  trendDown:'<path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/>',
  image:    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  help:     '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  instagram:'<rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  xlogo:    '<path d="M4 4h4.5L20 20h-4.5z"/><path d="M20 4l-6.6 6.9M4 20l6.6-6.9"/>',
  discord:  '<path d="M8.5 7.5C6.8 7.8 5.4 8.4 4.3 9.2 2.6 12.4 2.2 15.4 2.5 18.3c1.5 1.1 3 1.8 4.5 2.2l1.1-1.9M15.5 7.5c1.7.3 3.1.9 4.2 1.7 1.7 3.2 2.1 6.2 1.8 9.1-1.5 1.1-3 1.8-4.5 2.2l-1.1-1.9"/><path d="M7 17.2c3.3 1.4 6.7 1.4 10 0M8.5 8c2.3-.7 4.7-.7 7 0"/><circle cx="9.2" cy="13.5" r="1.2"/><circle cx="14.8" cy="13.5" r="1.2"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  tag:      '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
};

/* Devuelve el SVG de un icono */
const svgIcon = name =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* Sustituye cada <span data-icon="..."> del HTML por su SVG */
function hydrateIcons(ctx = document) {
  $$('[data-icon]', ctx).forEach(el => {
    if (el.dataset.done) return;
    el.innerHTML = svgIcon(el.dataset.icon);
    el.dataset.done = '1';
    el.classList.add('inline-block', 'shrink-0');
  });
}

/* ---------- Imágenes de cartas con fallback ---------- */
const POKEBALL_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M2 16h28" stroke="#fff" stroke-width="2.4"/><circle cx="16" cy="16" r="4.5" fill="none" stroke="#fff" stroke-width="2.4"/></svg>';

/* HTML de la carta de relleno hecha con CSS (degradado de marca, nombre y HP) */
function placeholderHTML(name, hp, type, cls = '') {
  return `<div class="card-ph ph-${type || 'fire'} ${cls}" role="img" aria-label="${name} (placeholder)">
    <div class="ph-top"><span>${name}</span><span class="ph-hp">HP ${hp}</span></div>
    <div class="ph-art">${POKEBALL_SVG}</div>
    <div class="ph-foot">CardDex</div></div>`;
}

/* Si la imagen falla (sin internet, URL rota...) se cambia por la carta de relleno.
   Es global porque se llama desde el atributo onerror de las <img>. */
function imgFallback(img) {
  img.onerror = null;
  const cls = img.className.replace('object-cover', '').replace('object-contain', '');
  const tmp = document.createElement('div');
  tmp.innerHTML = placeholderHTML(img.dataset.name || 'Pokémon', img.dataset.hp || '—', img.dataset.type, cls);
  img.replaceWith(tmp.firstElementChild);
}

/* Etiqueta <img> de una carta con el fallback ya incluido */
function cardImg(card, cls = '', lazy = true) {
  return `<img src="${card.img}" alt="${card.name}${card.set ? ' – ' + card.set : ''}" class="${cls}" ${lazy ? 'loading="lazy"' : ''} draggable="false"
               data-name="${card.name}" data-hp="${card.hp}" data-type="${card.type}" onerror="imgFallback(this)">`;
}

/* ---------- Toasts (mensajes de confirmación) ----------
   type: info | success | danger. El contenedor #toasts lo crea layout.js. */
function toast(msg, type = 'info') {
  const colors = { info: 'bg-dark text-white', success: 'bg-dark text-white', danger: 'bg-red2 text-white' };
  const icon = { info: 'info', success: 'check', danger: 'trash' }[type];
  const el = document.createElement('div');
  el.className = `toast-in pointer-events-auto flex items-center gap-2.5 max-w-[92%] rounded-2xl px-4 py-3 text-sm shadow-card ${colors[type]}`;
  el.innerHTML = `<span class="w-5 h-5 shrink-0 ${type === 'success' ? 'text-yellow' : ''}">${svgIcon(icon)}</span><span>${msg}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .25s, transform .25s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, 2400);
  setTimeout(() => el.remove(), 2700);
}
