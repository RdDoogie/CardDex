/* ==================================================================
   CardDex · pages/home.js
   Home: abanico de cartas en la tarjeta resumen y lista
   "Top of your collection". El resto de la página es HTML estático.
   ================================================================== */
(function () {
  // Abanico de 3 cartas en la tarjeta resumen
  function renderFan() {
    const pos = ['left-0 top-3 -rotate-12', 'left-[26px] top-0 z-10', 'left-[52px] top-3 rotate-12'];
    $('#homeFan').innerHTML = DATA.home.fan.map(getCard).map((c, i) => `
      <div class="absolute ${pos[i]} w-[52px] aspect-[63/88] rounded-md overflow-hidden shadow-lg ring-1 ring-white/20">
        ${cardImg(c, 'w-full h-full object-cover')}
      </div>`).join('');
  }

  // Lista de las cartas más valiosas (llevan a Card Details)
  function renderTopList() {
    $('#topList').innerHTML = DATA.home.top.map(getCard).map(c => `
      <li><a href="card.html" class="flex items-center gap-3 rounded-2xl bg-white border border-dark/10 p-2.5 pr-4 shadow-soft transition duration-200 hover:-translate-y-0.5 active:scale-[.98]">
        <span class="w-10 aspect-[63/88] rounded-md overflow-hidden shrink-0 bg-dark/5">${cardImg(c, 'w-full h-full object-cover')}</span>
        <span class="flex-1 min-w-0"><span class="block font-semibold text-sm truncate">${c.name}</span><span class="block text-xs text-dark/55">${c.set}</span></span>
        <span class="font-display font-bold text-sm">${fmtEUR(c.price)}</span>
      </a></li>`).join('');
  }

  renderFan();
  renderTopList();
})();
