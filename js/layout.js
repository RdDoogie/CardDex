/* ==================================================================
   CardDex · layout.js
   Estructura común a todas las páginas, para no repetir HTML:
   - Header fijo: en móvil logo + nombre + hamburguesa; en escritorio
     (lg, ≥1024px) logo + navegación horizontal
   - Menú lateral (drawer) con Services / Info / Socials (solo móvil/tablet)
   - Pie de página con Info / Socials
   - Contenedor de toasts
   Cada página HTML solo contiene su <main id="main">; este script
   construye el resto alrededor y marca el enlace activo usando
   <body data-page="...">.
   ================================================================== */

/* ---------- Enlaces del menú ---------- */
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

const pokeballSVG = cls => `
  <svg viewBox="0 0 32 32" class="${cls}" aria-hidden="true">
    <circle cx="16" cy="16" r="14.5" fill="#FEFEFF" />
    <path d="M1.5 16a14.5 14.5 0 0 1 29 0z" fill="#E70E02" />
    <path d="M1.5 16h29" stroke="#191D32" stroke-width="2.6" />
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="#191D32" stroke-width="2.2" />
    <circle cx="16" cy="16" r="5" fill="#FEFEFF" stroke="#191D32" stroke-width="2.6" />
    <circle cx="16" cy="16" r="1.8" fill="#191D32" opacity=".25" />
  </svg>`;

const logoText = cls => `<span class="font-display font-bold tracking-tight select-none ${cls}">Card<span class="text-red1">Dex</span></span>`;

// Enlaces de la barra de navegación de escritorio
function desktopNavHTML(currentPage) {
  const links = [{ label: 'Home', href: 'index.html', page: 'home' }, ...NAV[0].links];
  return links.map(l => {
    const active = l.page === currentPage;
    return `<a href="${l.href}" ${active ? 'aria-current="page"' : ''}
               class="px-3.5 py-2 rounded-xl text-sm font-semibold transition duration-200 ${active ? 'bg-red1/10 text-red1' : 'text-dark/70 hover:text-dark hover:bg-dark/5'}">${l.label}</a>`;
  }).join('');
}

// Header fijo
function headerHTML(currentPage) {
  return `
  <header class="sticky top-0 z-50 h-16 bg-bg/90 backdrop-blur-md border-b border-dark/5">
    <!-- Móvil / tablet: logo · nombre · hamburguesa -->
    <div class="lg:hidden h-full px-4 grid grid-cols-[40px_1fr_40px] items-center max-w-2xl mx-auto">
      <a href="index.html" aria-label="CardDex home" class="w-10 h-10 grid place-items-center rounded-xl transition duration-200 hover:scale-105 active:scale-95">${pokeballSVG('w-8 h-8')}</a>
      <p class="text-center">${logoText('text-[22px]')}</p>
      <button id="burger" type="button" class="burger relative w-10 h-10 rounded-xl transition duration-200 hover:bg-dark/5 active:scale-95"
              aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
    <!-- Escritorio: logo + navegación horizontal -->
    <div class="hidden lg:flex h-full max-w-6xl mx-auto px-8 items-center justify-between gap-6">
      <a href="index.html" aria-label="CardDex home" class="flex items-center gap-2.5 rounded-xl transition duration-200 hover:opacity-80">
        ${pokeballSVG('w-8 h-8')}${logoText('text-[22px]')}
      </a>
      <nav aria-label="Main" class="flex items-center gap-1">${desktopNavHTML(currentPage)}</nav>
    </div>
  </header>`;
}

// Una fila de enlace del menú lateral (activa si coincide con la página actual)
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

// Menú lateral completo con overlay (no existe en escritorio)
function drawerHTML(currentPage) {
  const sections = NAV.map(sec => `
    <div>
      <h2 class="text-[11px] font-semibold uppercase tracking-[.2em] text-dark/45">${sec.title}</h2>
      <ul class="mt-2 space-y-1">${sec.links.map(l => navLinkHTML(l, currentPage)).join('')}</ul>
    </div>`).join('');
  return `
    <div id="drawerRoot" class="invisible lg:hidden z-40 fixed top-16 bottom-0 inset-x-0">
      <div id="overlay" class="absolute inset-0 bg-dark/60 backdrop-blur-[2px] opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
      <nav id="drawer" aria-label="Main menu"
           class="absolute right-0 inset-y-0 w-4/5 max-w-sm bg-bg shadow-[-20px_0_40px_-10px_rgba(0,0,0,.35)] translate-x-full transition-transform duration-300 ease-out overflow-y-auto no-scrollbar px-5 py-6">
        <div class="space-y-7">${sections}</div>
        <p class="mt-10 text-[11px] text-dark/40">CardDex v1.0 · Prototype</p>
      </nav>
    </div>`;
}

// Pie de página: Info y Socials (en escritorio sustituye al menú lateral)
function footerHTML() {
  const link = l => `<a href="#" data-demo="${l.label}" class="inline-flex items-center gap-1.5 text-dark/60 hover:text-red1 transition"><span data-icon="${l.icon}" class="w-4 h-4"></span>${l.label}</a>`;
  return `
  <footer id="footer" class="border-t border-dark/10 mt-4">
    <div class="max-w-md md:max-w-2xl lg:max-w-6xl mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between text-sm">
      <p class="flex items-center gap-2">${pokeballSVG('w-5 h-5')}<span class="text-dark/50">CardDex v1.0 · Prototype</span></p>
      <div class="flex flex-wrap gap-x-5 gap-y-2">${NAV[1].links.map(link).join('')}</div>
      <div class="flex flex-wrap gap-x-5 gap-y-2">${NAV[2].links.map(link).join('')}</div>
    </div>
  </footer>`;
}

// Contenedor de los toasts
const toastsHTML = `
  <div id="toasts" class="z-[60] fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex flex-col items-center gap-2 pointer-events-none" aria-live="polite" role="status"></div>`;

/* ---------- Construcción de la estructura ---------- */
function buildLayout() {
  const page = document.body.dataset.page;
  const main = $('#main');

  document.body.classList.add('font-sans', 'text-dark', 'bg-bg', 'antialiased', 'overflow-x-hidden', 'min-h-screen', 'flex', 'flex-col');
  // Ancho del contenido: columna en móvil, más ancho en tablet y escritorio
  main.classList.add('w-full', 'flex-1', 'max-w-md', 'md:max-w-2xl', 'lg:max-w-6xl', 'mx-auto', 'lg:px-8', 'lg:pt-10');

  main.insertAdjacentHTML('beforebegin', headerHTML(page) + drawerHTML(page));
  main.insertAdjacentHTML('afterend', footerHTML() + toastsHTML);
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
  document.body.classList.add('overflow-hidden');    // bloquea el scroll de fondo
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
  drawerState.timer = setTimeout(() => $('#drawerRoot').classList.add('invisible'), 300);
  if (returnFocus) burger.focus({ preventScroll: true });
}

function initDrawer() {
  $('#burger').addEventListener('click', () => (drawerState.open ? closeDrawer() : openDrawer()));
  $('#overlay').addEventListener('click', () => closeDrawer());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // Al elegir un destino real, el menú se cierra (y el navegador cambia de página)
  $$('#drawer a[href$=".html"]').forEach(a => a.addEventListener('click', () => closeDrawer(false)));

  // Si la ventana pasa a tamaño escritorio con el menú abierto, se cierra
  window.matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) closeDrawer(false); });

  // Enlaces de ejemplo (Info y Socials), en el menú lateral y en el pie
  document.addEventListener('click', e => {
    const demo = e.target.closest('[data-demo]');
    if (!demo) return;
    e.preventDefault();
    closeDrawer(false);
    toast(`${demo.dataset.demo} — demo link`);
  });
}

/* Si el navegador recupera la página desde caché al pulsar "atrás", cerramos el menú */
window.addEventListener('pageshow', () => closeDrawer(false));

/* ---------- Inicio ---------- */
buildLayout();
initDrawer();
