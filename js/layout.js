/* ==================================================================
   CardDex · layout.js
   Estructura común a todas las páginas, para no repetir HTML:
   - Marco del "teléfono" (y fondo decorativo en escritorio)
   - Header fijo: logo Pokébola, nombre y botón hamburguesa
   - Menú lateral (drawer) con Services / Info / Socials
   - Contenedor de toasts
   Cada página HTML solo contiene su <main id="main">; este script
   construye el resto alrededor y marca el enlace activo usando
   <body data-page="...">.
   ================================================================== */

/* ---------- Enlaces del menú lateral ---------- */
const NAV = [
  { title: 'Services', links: [
    { label: 'Card Details',   href: 'card.html',   page: 'card',   icon: 'card' },
    { label: 'Binder Builder', href: 'binder.html', page: 'binder', icon: 'grid' },
    { label: 'AI Card Grader', href: 'grader.html', page: 'grader', icon: 'scan' },
  ]},
  { title: 'Info', links: [            // enlaces de ejemplo (muestran un toast)
    { label: 'About CardDex', icon: 'info' },
    { label: 'How it works',  icon: 'book' },
    { label: 'FAQ',           icon: 'help' },
  ]},
  { title: 'Socials', links: [
    { label: 'Instagram',   icon: 'instagram' },
    { label: 'X / Twitter', icon: 'xlogo' },
    { label: 'Discord',     icon: 'discord' },
  ]},
];

/* ---------- Plantillas HTML ---------- */

// Fondo decorativo y texto del proyecto (solo escritorio)
const desktopBackdropHTML = `
  <div class="hidden md:block fixed inset-0 pointer-events-none" aria-hidden="true"
       style="background: radial-gradient(60% 50% at 20% 10%, rgba(231,14,2,.22), transparent 60%), radial-gradient(50% 40% at 85% 90%, rgba(250,169,22,.14), transparent 60%);"></div>
  <div class="hidden xl:block fixed left-12 top-1/2 -translate-y-1/2 max-w-xs" aria-hidden="true">
    <p class="font-display font-bold text-4xl text-white leading-tight">CardDex</p>
    <p class="mt-3 text-sm leading-relaxed text-white/60">Interactive mobile prototype for Pokémon TCG collectors. Use the menu to explore Card Details, Binder Builder and AI Card Grader.</p>
    <p class="mt-6 text-xs uppercase tracking-[.2em] text-yellow">Interface design · Prototype</p>
  </div>`;

// Barra de estado falsa (solo escritorio, para que parezca un dispositivo)
const statusBarHTML = `
  <div class="hidden md:flex h-9 shrink-0 items-center justify-between px-8 text-[12px] font-semibold bg-bg relative z-50" aria-hidden="true">
    <span>9:41</span>
    <span class="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 rounded-full bg-[#0c0f1e]"></span>
    <span class="flex items-center gap-1.5">
      <svg class="w-4 h-3" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg class="w-6 h-3" viewBox="0 0 26 12" fill="none" stroke="currentColor"><rect x=".5" y=".5" width="22" height="11" rx="3"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="currentColor"/><path d="M24.5 4v4" stroke-linecap="round"/></svg>
    </span>
  </div>`;

// Header fijo: logo (vuelve a Home), nombre y hamburguesa
const headerHTML = `
  <header class="sticky top-0 z-50 h-16 bg-bg/90 backdrop-blur-md border-b border-dark/5">
    <div class="h-full px-4 grid grid-cols-[40px_1fr_40px] items-center">
      <a href="index.html" aria-label="CardDex home" class="w-10 h-10 grid place-items-center rounded-xl transition duration-200 hover:scale-105 active:scale-95">
        <svg viewBox="0 0 32 32" class="w-8 h-8" aria-hidden="true">
          <circle cx="16" cy="16" r="14.5" fill="#FEFEFF" />
          <path d="M1.5 16a14.5 14.5 0 0 1 29 0z" fill="#E70E02" />
          <path d="M1.5 16h29" stroke="#191D32" stroke-width="2.6" />
          <circle cx="16" cy="16" r="14.5" fill="none" stroke="#191D32" stroke-width="2.2" />
          <circle cx="16" cy="16" r="5" fill="#FEFEFF" stroke="#191D32" stroke-width="2.6" />
          <circle cx="16" cy="16" r="1.8" fill="#191D32" opacity=".25" />
        </svg>
      </a>
      <p class="text-center font-display font-bold text-[22px] tracking-tight select-none">Card<span class="text-red1">Dex</span></p>
      <button id="burger" type="button" class="burger relative w-10 h-10 rounded-xl transition duration-200 hover:bg-dark/5 active:scale-95"
              aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

// Una fila de enlace del menú (activa si coincide con la página actual)
function navLinkHTML(link, currentPage) {
  const active = link.page && link.page === currentPage;
  const attrs = link.href ? `href="${link.href}"` : `href="#" data-demo="${link.label}"`;
  return `
    <li><a ${attrs} ${active ? 'aria-current="page"' : ''}
           class="flex items-center gap-3 rounded-xl px-2 py-2.5 transition duration-200 active:scale-[.98] ${active ? 'bg-red1/10 text-red1' : 'hover:bg-dark/5'}">
      <span class="w-9 h-9 rounded-lg grid place-items-center ${active ? 'bg-red1 text-white' : 'bg-dark/5'}"><span data-icon="${link.icon}" class="w-[18px] h-[18px]"></span></span>
      <span class="flex-1 font-medium">${link.label}</span>
      ${link.href ? '<span data-icon="chevronRight" class="w-4 h-4 text-dark/30"></span>' : ''}
    </a></li>`;
}

// Menú lateral completo con overlay
function drawerHTML(currentPage) {
  const sections = NAV.map(sec => `
    <div>
      <h2 class="text-[11px] font-semibold uppercase tracking-[.2em] text-dark/45">${sec.title}</h2>
      <ul class="mt-2 space-y-1">${sec.links.map(l => navLinkHTML(l, currentPage)).join('')}</ul>
    </div>`).join('');
  return `
    <div id="drawerRoot" class="invisible z-40 fixed top-16 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                                md:absolute md:top-[100px] md:left-0 md:translate-x-0 md:max-w-none">
      <div id="overlay" class="absolute inset-0 bg-dark/60 backdrop-blur-[2px] opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
      <nav id="drawer" aria-label="Main menu"
           class="absolute right-0 inset-y-0 w-4/5 bg-bg shadow-[-20px_0_40px_-10px_rgba(0,0,0,.35)] translate-x-full transition-transform duration-300 ease-out overflow-y-auto no-scrollbar px-5 py-6">
        <div class="space-y-7">${sections}</div>
        <p class="mt-10 text-[11px] text-dark/40">CardDex v1.0 · Prototype</p>
      </nav>
    </div>`;
}

// Contenedor de los toasts
const toastsHTML = `
  <div id="toasts" class="z-[60] fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex flex-col items-center gap-2 pointer-events-none
                          md:absolute md:left-0 md:translate-x-0 md:max-w-none" aria-live="polite" role="status"></div>`;

/* ---------- Construcción del marco ---------- */
function buildLayout() {
  const page = document.body.dataset.page;
  const main = $('#main');

  document.body.classList.add('font-sans', 'text-dark', 'bg-bg', 'md:bg-dark', 'antialiased', 'overflow-x-hidden');
  document.body.insertAdjacentHTML('afterbegin', desktopBackdropHTML);

  // "Teléfono": ocupa toda la pantalla en móvil y se centra con sombra en escritorio
  const phone = document.createElement('div');
  phone.id = 'phone';
  phone.className = `relative max-w-md mx-auto min-h-screen bg-bg overflow-x-clip
    md:min-h-0 md:my-6 md:h-[min(900px,calc(100vh-3rem))] md:rounded-[46px] md:overflow-hidden
    md:shadow-phone md:ring-[10px] md:ring-[#0c0f1e] md:flex md:flex-col`;
  phone.innerHTML = statusBarHTML
    + `<div id="scroller" class="md:flex-1 md:overflow-y-auto no-scrollbar">${headerHTML}</div>`
    + drawerHTML(page)
    + toastsHTML;

  main.before(phone);
  $('#scroller').appendChild(main);          // el contenido de la página va bajo el header
  main.classList.add('screen-enter');        // animación de entrada de la página
  hydrateIcons();
}

/* ---------- Comportamiento del menú lateral ---------- */
const drawerState = { open: false, timer: null };

function openDrawer() {
  const root = $('#drawerRoot'), burger = $('#burger');
  clearTimeout(drawerState.timer);
  drawerState.open = true;
  root.classList.remove('invisible');
  requestAnimationFrame(() => {
    $('#overlay').classList.replace('opacity-0', 'opacity-100');
    $('#drawer').classList.replace('translate-x-full', 'translate-x-0');
  });
  burger.classList.add('is-open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close menu');
  $('#main').inert = true;                           // el contenido de detrás no recibe foco
  document.body.classList.add('overflow-hidden');    // bloquea el scroll de fondo (móvil)
  if (DESKTOP.matches) $('#scroller').style.overflowY = 'hidden'; // en móvil rompería el header sticky
  setTimeout(() => $('#drawer a')?.focus({ preventScroll: true }), 300);
}

function closeDrawer(returnFocus = true) {
  if (!drawerState.open) return;
  const burger = $('#burger');
  drawerState.open = false;
  $('#overlay').classList.replace('opacity-100', 'opacity-0');
  $('#drawer').classList.replace('translate-x-0', 'translate-x-full');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  $('#main').inert = false;
  document.body.classList.remove('overflow-hidden');
  $('#scroller').style.overflowY = '';
  drawerState.timer = setTimeout(() => $('#drawerRoot').classList.add('invisible'), 300);
  if (returnFocus) burger.focus({ preventScroll: true });
}

function initDrawer() {
  $('#burger').addEventListener('click', () => (drawerState.open ? closeDrawer() : openDrawer()));
  $('#overlay').addEventListener('click', () => closeDrawer());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // Al elegir un destino real, el menú se cierra (y el navegador cambia de página)
  $$('#drawer a[href$=".html"]').forEach(a => a.addEventListener('click', () => closeDrawer(false)));

  // Enlaces de ejemplo (Info y Socials)
  $('#drawer').addEventListener('click', e => {
    const demo = e.target.closest('[data-demo]');
    if (!demo) return;
    e.preventDefault();
    closeDrawer();
    toast(`${demo.dataset.demo} — demo link`);
  });
}

/* Si el navegador recupera la página desde caché al pulsar "atrás", cerramos el menú */
window.addEventListener('pageshow', () => closeDrawer(false));

/* ---------- Inicio ---------- */
buildLayout();
initDrawer();
