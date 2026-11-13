/* ==================================================================
   CardDex · pages/home.js
   Home: abanico de cartas en la tarjeta resumen, lista "Top of your
   collection" y rejilla con toda la colección. Cada carta enlaza a
   su ficha en card.html?id=<id>. El resto de la página es HTML estático.
   ================================================================== */
(function () {
  const cardUrl = c => `card.html?id=${encodeURIComponent(c.id)}`;

  // Abanico de 3 cartas en la tarjeta resumen
  function renderFan() {
    const pos = ['left-0 top-3 -rotate-12', 'left-[26px] top-0 z-10', 'left-[52px] top-3 rotate-12'];
    $('#homeFan').innerHTML = DATA.home.fan.map(getCard).map((c, i) => `
      <div class="absolute ${pos[i]} w-[52px] aspect-[63/88] rounded-md overflow-hidden shadow-lg ring-1 ring-white/20">
        ${cardImg(c, 'w-full h-full object-cover')}
      </div>`).join('');
  }

  // Lista de las cartas más valiosas (llevan a la ficha de cada una)
  function renderTopList() {
    $('#topList').innerHTML = DATA.home.top.map(getCard).map(c => `
      <li><a href="${cardUrl(c)}" class="flex items-center gap-3 rounded-2xl bg-white border border-dark/10 p-2.5 pr-4 shadow-soft transition duration-200 hover:-translate-y-0.5 active:scale-[.98]">
        <span class="w-10 aspect-[63/88] rounded-md overflow-hidden shrink-0 bg-dark/5">${cardImg(c, 'w-full h-full object-cover')}</span>
        <span class="flex-1 min-w-0"><span class="block font-semibold text-sm truncate">${c.name}</span><span class="block text-xs text-dark/55">${c.set}</span></span>
        <span class="font-display font-bold text-sm">${fmtEUR(c.price)}</span>
      </a></li>`).join('');
  }

  // Rejilla con todas las cartas de la colección
  function renderCollection() {
    $('#collectionGrid').innerHTML = DATA.cards.map(c => `
      <li><a href="${cardUrl(c)}" class="group block">
        <span class="block aspect-[63/88] rounded-xl overflow-hidden bg-dark/5 shadow-soft transition duration-200 group-hover:-translate-y-1 group-hover:shadow-card group-active:scale-[.97]">${cardImg(c, 'w-full h-full object-cover')}</span>
        <span class="mt-1.5 block text-xs font-semibold truncate">${c.name}</span>
        <span class="block text-[11px] text-dark/55">${fmtEUR(c.price)}</span>
      </a></li>`).join('');
  }

  renderFan();
  renderTopList();
  renderCollection();
})();
