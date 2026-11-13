/* ==================================================================
   CardDex · pages/binder.js
   Binder Builder (método Michi): hoja de 9 / 12 fundas, carrusel de
   cartas, colocar con toque o drag & drop, y modo Fusion Pockets.
   ================================================================== */
(function () {
  const sheetEl = $('#sheet'), carousel = $('#carousel');

  /* ---------- Estado de esta página ---------- */
  const state = {
    layout: 9,
    // Cada distribución tiene su propia hoja (id de carta o null) y sus fusiones
    sheets:  { 9: Array(9).fill(null), 12: Array(12).fill(null) },
    fusions: { 9: new Set(), 12: new Set() }, // índice inicial de cada pareja fusionada
    fusionMode: false,
    selected: null,    // id de la carta seleccionada en el carrusel
    tab: 'cards',      // 'cards' | 'images'
    userImages: [],    // imágenes subidas en la pestaña "Images"
  };
  Object.entries(DATA.binder.preset9).forEach(([i, id]) => { state.sheets[9][i] = id; });

  const cols       = () => (state.layout === 9 ? 3 : 4);
  const curSheet   = () => state.sheets[state.layout];
  const curFusions = () => state.fusions[state.layout];
  // Busca en la colección y en las imágenes subidas
  const findCard   = id => getCard(id) || state.userImages.find(c => c.id === id);

  /* ---------- Renderizado ---------- */

  // Hoja del archivador (huecos vacíos, llenos y fusionados)
  function renderSheet() {
    const sheet = curSheet(), fus = curFusions();
    sheetEl.className = `sheet relative grid gap-2 ${cols() === 3 ? 'grid-cols-3' : 'grid-cols-4'}`;
    sheetEl.classList.toggle('fusion-mode', state.fusionMode);
    sheetEl.classList.toggle('awaiting', !!state.selected && !state.fusionMode);

    let html = '';
    for (let i = 0; i < sheet.length; i++) {
      if (fus.has(i - 1)) continue; // este hueco forma parte de la fusión anterior
      const fused = fus.has(i);
      const card = sheet[i] ? findCard(sheet[i]) : null;
      const label = card ? `Pocket ${i + 1}: ${card.name}. Tap to remove` : `Pocket ${i + 1}: empty`;
      html += `
        <button type="button" role="gridcell" data-index="${i}" aria-label="${label}${fused ? ' (double pocket)' : ''}"
                class="pocket ${card ? '' : 'empty'} ${fused ? 'fused col-span-2' : ''} grid place-items-center hover:scale-[1.03] active:scale-95">
          ${card
            ? `<span class="pop-in absolute inset-[3px] rounded-[7px] overflow-hidden ${fused ? 'flex justify-center bg-black/20' : ''}">${cardImg(card, `h-full ${fused ? 'w-auto aspect-[63/88]' : 'w-full'} object-cover`)}</span>`
            : `<span class="w-5 h-5 text-white/30">${svgIcon('plus')}</span>`}
          ${fused ? '<span class="absolute -top-2 left-1/2 -translate-x-1/2 z-10 rounded-full bg-yellow text-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Double</span>' : ''}
        </button>`;
    }
    sheetEl.innerHTML = html;
    $('#pageLabel').textContent = `Page 1 · ${state.layout} pockets`;
    renderControls();
    renderHint();
  }

  // Control segmentado 9/12 y botón Fusion Pockets
  function renderControls() {
    $$('.layout-btn').forEach(btn => {
      const on = +btn.dataset.layout === state.layout;
      btn.classList.toggle('bg-red1', on);
      btn.classList.toggle('text-white', on);
      btn.classList.toggle('shadow', on);
      btn.classList.toggle('text-dark/60', !on);
      btn.setAttribute('aria-pressed', on);
    });
    const fb = $('#fusionBtn');
    fb.setAttribute('aria-pressed', state.fusionMode);
    fb.classList.toggle('bg-yellow', state.fusionMode);
    fb.classList.toggle('border-yellow', state.fusionMode);
    fb.classList.toggle('bg-white', !state.fusionMode);
  }

  // Texto de ayuda bajo la hoja
  function renderHint() {
    const hint = $('#binderHint');
    if (state.fusionMode) hint.textContent = 'Fusion mode: tap a pocket to merge it with its neighbour (tap again to split).';
    else if (state.selected) hint.innerHTML = `<b class="text-dark">${findCard(state.selected).name}</b> selected — now tap an empty pocket.`;
    else hint.textContent = 'Tap a card below, then a pocket. Tap a placed card to remove it. You can also drag & drop.';
  }

  // Carrusel (pestaña "Your cards" o "Images")
  function renderCarousel() {
    const inSheet = new Set(curSheet().filter(Boolean));
    const list = state.tab === 'cards' ? DATA.cards : state.userImages;

    let html = list.map(c => {
      const placed = inSheet.has(c.id), sel = state.selected === c.id;
      return `
        <button type="button" draggable="${!placed}" data-card="${c.id}" aria-pressed="${sel}" aria-label="${c.name}${placed ? ' (already in this page)' : ''}"
                class="relative shrink-0 snap-start w-[64px] aspect-[63/88] rounded-lg overflow-hidden bg-dark/5 shadow-soft transition duration-200
                       ${sel ? 'ring-[3px] ring-red1 -translate-y-1.5 shadow-card' : 'hover:-translate-y-1'} ${placed ? 'opacity-40' : ''} active:scale-95">
          ${cardImg(c, 'w-full h-full object-cover pointer-events-none')}
          ${placed ? `<span class="absolute inset-0 grid place-items-center bg-dark/40"><span class="w-6 h-6 rounded-full bg-white text-dark p-1">${svgIcon('check')}</span></span>` : ''}
        </button>`;
    }).join('');

    if (state.tab === 'images') {
      html = `
        <button type="button" id="addImageBtn" aria-label="Add image from your device"
                class="shrink-0 snap-start w-[64px] aspect-[63/88] rounded-lg border-2 border-dashed border-dark/25 grid place-items-center text-dark/50 transition duration-200 hover:border-red1 hover:text-red1 active:scale-95">
          <span class="flex flex-col items-center gap-1 text-[10px] font-semibold"><span class="w-5 h-5">${svgIcon('upload')}</span>Add</span>
        </button>` + html;
      if (!state.userImages.length) html += '<p class="self-center text-xs text-dark/50 pl-1 leading-snug">Add photos of your own cards<br>to place them in the binder.</p>';
    }
    carousel.innerHTML = html;

    $$('.tab-btn').forEach(t => {
      const on = t.dataset.tab === state.tab;
      t.setAttribute('aria-selected', on);
      t.classList.toggle('text-dark', on);
      t.classList.toggle('text-dark/40', !on);
      ['underline', 'decoration-red1', 'decoration-2', 'underline-offset-4'].forEach(c => t.classList.toggle(c, on));
    });
  }

  const renderAll = () => { renderSheet(); renderCarousel(); };

  /* ---------- Acciones ---------- */

  // Coloca una carta en un hueco (una misma carta solo puede estar una vez por hoja)
  function placeCard(index, id) {
    const sheet = curSheet();
    const existing = sheet.indexOf(id);
    if (existing !== -1) sheet[existing] = null;
    sheet[index] = id;
    state.selected = null;
    renderAll();
    toast(`${findCard(id).name} placed in pocket ${index + 1}`, 'success');
  }

  function removeCard(index) {
    const name = findCard(curSheet()[index]).name;
    curSheet()[index] = null;
    renderAll();
    toast(`${name} removed from the page`);
  }

  // Fusiona/separa dos huecos contiguos de la misma fila
  function toggleFusion(index) {
    const fus = curFusions(), sheet = curSheet(), c = cols();
    if (fus.has(index)) {
      fus.delete(index);
      renderAll();
      return toast('Double pocket split into two');
    }
    const start = (index % c === c - 1) ? index - 1 : index; // última columna: se une con la izquierda
    if (fus.has(start - 1) || fus.has(start + 1)) return toast('That pocket is already part of a double pocket');
    if (sheet[start + 1] && !sheet[start]) sheet[start] = sheet[start + 1]; // conserva la carta de la derecha
    sheet[start + 1] = null;
    fus.add(start);
    renderAll();
    toast('Pockets fused — perfect for horizontal cards or pairs', 'success');
  }

  function toggleFusionMode() {
    state.fusionMode = !state.fusionMode;
    state.selected = null;
    if (state.fusionMode) {
      // Si no hay ninguna fusión, se crea una de ejemplo en la última fila para que se vea el efecto
      const fus = curFusions();
      if (!fus.size) {
        const start = state.layout - cols();
        curSheet()[start + 1] = null;
        fus.add(start);
      }
      toast('Fusion mode on: two pockets become one double pocket (yellow). Tap pockets to merge or split.', 'success');
    } else {
      toast('Fusion mode off');
    }
    renderAll();
  }

  // Cambiar entre 9 y 12 huecos con animación
  function changeLayout(n) {
    if (n === state.layout) return;
    sheetEl.classList.add('sheet-out');
    setTimeout(() => {
      state.layout = n;
      state.selected = null;
      state.fusionMode = false;
      renderAll();
      sheetEl.classList.add('sheet-out');
      requestAnimationFrame(() => requestAnimationFrame(() => sheetEl.classList.remove('sheet-out')));
    }, REDUCED ? 0 : 180);
  }

  /* ---------- Eventos ---------- */
  function initEvents() {
    // Toque en un hueco de la hoja
    sheetEl.addEventListener('click', e => {
      const pocket = e.target.closest('.pocket');
      if (!pocket) return;
      const i = +pocket.dataset.index;
      if (state.fusionMode) return toggleFusion(i);
      if (curSheet()[i]) return removeCard(i);
      if (state.selected) return placeCard(i, state.selected);
      toast('Select a card from the carousel first');
    });

    // Toque en una carta del carrusel
    carousel.addEventListener('click', e => {
      if (e.target.closest('#addImageBtn')) return $('#binderUpload').click();
      const item = e.target.closest('[data-card]');
      if (!item) return;
      const id = item.dataset.card;
      if (curSheet().includes(id)) return toast('This card is already in this page');
      if (state.fusionMode) { state.fusionMode = false; toast('Fusion mode off'); }
      state.selected = state.selected === id ? null : id;
      renderAll();
    });

    // Drag & drop nativo HTML5 (escritorio)
    carousel.addEventListener('dragstart', e => {
      const item = e.target.closest('[data-card]');
      if (!item) return;
      e.dataTransfer.setData('text/plain', item.dataset.card);
      e.dataTransfer.effectAllowed = 'copy';
    });
    sheetEl.addEventListener('dragover', e => {
      const p = e.target.closest('.pocket');
      if (!p || state.fusionMode) return;
      e.preventDefault();
      $$('.pocket.drop-target', sheetEl).forEach(x => x !== p && x.classList.remove('drop-target'));
      p.classList.add('drop-target');
    });
    sheetEl.addEventListener('dragleave', e => {
      const p = e.target.closest('.pocket');
      if (p && !p.contains(e.relatedTarget)) p.classList.remove('drop-target');
    });
    sheetEl.addEventListener('drop', e => {
      const p = e.target.closest('.pocket');
      if (!p) return;
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      if (id && findCard(id)) placeCard(+p.dataset.index, id);
    });

    // Controles
    $$('.layout-btn').forEach(btn => btn.addEventListener('click', () => changeLayout(+btn.dataset.layout)));
    $('#fusionBtn').addEventListener('click', toggleFusionMode);

    // Flechas del carrusel
    const scrollCarousel = dx => carousel.scrollBy({ left: dx, behavior: REDUCED ? 'auto' : 'smooth' });
    $('#carPrev').addEventListener('click', () => scrollCarousel(-150));
    $('#carNext').addEventListener('click', () => scrollCarousel(150));

    // Pestañas Your cards | Images
    $$('.tab-btn').forEach(t => t.addEventListener('click', () => {
      state.tab = t.dataset.tab;
      carousel.scrollLeft = 0;
      renderCarousel();
    }));

    // Subir imagen propia (solo vista previa local con createObjectURL, no se sube nada)
    $('#binderUpload').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      state.userImages.push({
        id: 'user' + Date.now(), name: `My card ${state.userImages.length + 1}`,
        hp: '—', type: 'dark', img: URL.createObjectURL(file),
      });
      e.target.value = '';
      renderCarousel();
      toast('Image added — tap it, then tap a pocket', 'success');
    });
  }

  /* ---------- Inicio ---------- */
  renderAll();
  initEvents();
})();
