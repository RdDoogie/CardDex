/* ==================================================================
   CardDex · pages/card.js
   Card Details: carta holográfica, desplegable de acciones,
   precio "Last sold", gráfico SVG de historial y ventas recientes.
   ================================================================== */
(function () {
  /* ---------- Datos de la carta elegida ---------- */

  // Generador pseudoaleatorio con semilla: cada carta tiene siempre "su" historial
  function seededRandom(str) {
    let h = 2166136261;
    for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), h | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Historial de precios (Raw y PSA 10) y ventas recientes a partir del precio de la carta
  function buildDetail(card) {
    const rnd = seededRandom(card.id);
    const between = (a, b) => a + rnd() * (b - a);
    // 7 puntos que van de start·precio hasta el precio actual, con algo de ruido
    const series = (end, start, noise) => Array.from({ length: 7 }, (_, i) =>
      i === 6 ? end : Math.round(end * (start + (1 - start) * (i / 6)) * (1 + between(-noise, noise))));

    const chart = {};
    const starts = { '1M': between(.92, 1.04), '3M': between(.8, 1.03), '1Y': between(.55, 1.06) };
    Object.entries(starts).forEach(([range, start]) => {
      chart[range] = {
        labels: DATA.chartLabels[range],
        raw: series(card.price, start, .025),
        psa: series(card.psa10, start * between(.96, 1.04), .02),
      };
    });

    const { platforms } = DATA.detail;
    const offset = Math.floor(rnd() * platforms.length);   // cada venta en una plataforma distinta
    const sales = DATA.detail.saleDates.map((date, i) => {
      const cond = i === 2 ? 'LP' : 'NM';
      const f = (i === 0 ? 1 : between(.95, 1.02)) * (cond === 'LP' ? .88 : 1);
      return { date, cond, platform: platforms[(offset + i) % platforms.length], price: Math.max(1, Math.round(card.price * f)) };
    });

    return { chart, sales, price30dAgo: chart['1M'].raw[0] };
  }

  // La carta se elige con ?id= (p. ej. card.html?id=umbreon); si no existe, la de por defecto
  const requestedId = new URLSearchParams(location.search).get('id');
  const card = getCard(requestedId) || getCard(DATA.detail.defaultId);
  const detail = buildDetail(card);
  const holo = $('#holoCard'), actionsBtn = $('#actionsBtn'), actionsMenu = $('#actionsMenu');

  // Estado de esta página
  const state = { lang: 0, cond: 0, price: card.price, range: '1M', chartShown: null };

  /* ---------- Información de la carta ---------- */
  function renderInfo() {
    holo.innerHTML = cardImg(card, 'w-full h-full object-cover rounded-2xl', false);
    $('#cardName').textContent = card.name;
    $('#cardSet').textContent = `${card.set} · ${card.number}`;
    document.title = `${card.name} · CardDex`;
    renderInfoChips();
  }

  // Tira con el resto de cartas de la colección (cada una abre su ficha)
  function renderMoreCards() {
    $('#moreCards').innerHTML = DATA.cards.filter(c => c.id !== card.id).map(c => `
      <a href="card.html?id=${c.id}" class="group shrink-0 snap-start w-[72px]" aria-label="${c.name}">
        <span class="block aspect-[63/88] rounded-lg overflow-hidden bg-dark/5 shadow-soft transition duration-200 group-hover:-translate-y-1">${cardImg(c, 'w-full h-full object-cover')}</span>
        <span class="mt-1 block text-[10px] text-dark/60 truncate">${c.name}</span>
      </a>`).join('');
  }

  // Chips de idioma y estado
  function renderInfoChips() {
    $('#chipLang').textContent = DATA.detail.languages[state.lang];
    $('#chipCond').textContent = DATA.detail.conditions[state.cond];
  }

  function renderSales() {
    $('#salesList').innerHTML = detail.sales.map(s => `
      <li class="flex items-center gap-3 px-4 py-3">
        <span class="w-9 h-9 rounded-xl bg-dark/5 grid place-items-center text-dark/60"><span class="w-4 h-4">${svgIcon('tag')}</span></span>
        <span class="flex-1 min-w-0"><span class="block text-sm font-semibold">${s.platform}</span><span class="block text-xs text-dark/55">${s.date} · ${s.cond}</span></span>
        <span class="font-display font-bold">${fmtEUR(s.price)}</span>
      </li>`).join('');
  }

  // Precio "Last sold" y variación (verde si sube, rojo si baja)
  function renderPrice(flash = false) {
    const el = $('#lastSold');
    el.textContent = fmtEUR(state.price);
    const delta = (state.price / detail.price30dAgo - 1) * 100;
    const up = delta >= 0;
    const badge = $('#priceDelta');
    badge.className = `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${up ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red1/20 text-red-300'}`;
    badge.innerHTML = `<span class="w-3.5 h-3.5">${svgIcon(up ? 'trendUp' : 'trendDown')}</span>${fmtPct(delta)}`;
    if (flash) { el.classList.remove('price-flash'); void el.offsetWidth; el.classList.add('price-flash'); }
  }

  /* ---------- Efecto holográfico ---------- */
  function initHolo() {
    // Inclinación 3D con el ratón
    holo.addEventListener('pointermove', e => {
      if (REDUCED || e.pointerType !== 'mouse') return;
      const r = holo.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      holo.style.setProperty('--ry', `${(x - .5) * 16}deg`);
      holo.style.setProperty('--rx', `${(.5 - y) * 16}deg`);
      holo.style.setProperty('--mx', `${x * 100}%`);
      holo.style.setProperty('--my', `${y * 100}%`);
      holo.style.setProperty('--o', '.7');
    });
    holo.addEventListener('pointerleave', () => {
      holo.style.setProperty('--rx', '0deg');
      holo.style.setProperty('--ry', '0deg');
      holo.style.setProperty('--o', '0');
    });
    // Al tocar: barrido de brillo y pequeño balanceo
    holo.addEventListener('click', () => {
      holo.classList.remove('flash'); void holo.offsetWidth; holo.classList.add('flash');
      holo.style.setProperty('--o', '.6');
      setTimeout(() => {
        holo.classList.remove('flash');
        if (!holo.matches(':hover')) holo.style.setProperty('--o', '0');
      }, 850);
    });
  }

  /* ---------- Desplegable de acciones ---------- */
  function openActions() {
    actionsMenu.classList.remove('closed');
    actionsBtn.setAttribute('aria-expanded', 'true');
    $('#actionsChevron').style.transform = 'rotate(180deg)';
    actionsMenu.querySelector('[role="menuitem"]').focus({ preventScroll: true });
  }

  function closeActions(returnFocus = false) {
    if (actionsMenu.classList.contains('closed')) return;
    actionsMenu.classList.add('closed');
    actionsBtn.setAttribute('aria-expanded', 'false');
    $('#actionsChevron').style.transform = '';
    if (returnFocus) actionsBtn.focus({ preventScroll: true });
  }

  // Simula una consulta de precio: el icono gira y el precio cambia ±4 %
  function refreshPrice() {
    const icon = $('#refreshIcon');
    icon.classList.add('animate-spin');
    setTimeout(() => {
      icon.classList.remove('animate-spin');
      state.price = Math.round(state.price * (1 + (Math.random() * 8 - 4) / 100));
      Object.values(detail.chart).forEach(r => { r.raw[r.raw.length - 1] = state.price; }); // último punto del gráfico
      renderPrice(true);
      drawChart(true);
      closeActions();
      toast(`Price updated: ${fmtEUR(state.price)}`, 'success');
    }, 900);
  }

  // Cada opción del menú
  const ACTIONS = {
    state() {
      state.cond = (state.cond + 1) % DATA.detail.conditions.length;
      renderInfoChips();
      toast(`Condition changed to ${DATA.detail.conditions[state.cond]}`, 'success');
      closeActions();
    },
    language() {
      state.lang = (state.lang + 1) % DATA.detail.languages.length;
      renderInfoChips();
      toast(`Language changed to ${DATA.detail.languages[state.lang]}`, 'success');
      closeActions();
    },
    refresh: refreshPrice,
    delete() {
      closeActions();
      toast('Card deleted (demo — nothing was removed)', 'danger');
    },
  };

  function initActions() {
    actionsBtn.addEventListener('click', e => {
      e.stopPropagation();
      actionsMenu.classList.contains('closed') ? openActions() : closeActions();
    });
    actionsMenu.addEventListener('click', e => {
      const item = e.target.closest('[data-action]');
      if (item) ACTIONS[item.dataset.action]();
    });
    // Cerrar al pulsar fuera o con Escape
    document.addEventListener('click', e => { if (!e.target.closest('#actionsMenu, #actionsBtn')) closeActions(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeActions(true); });
  }

  /* ---------- Gráfico SVG de historial de precio ---------- */
  // En escritorio el gráfico es más ancho (más unidades en el viewBox) para que el texto no se agrande
  const CH = { W: 320, H: 200, l: 40, r: 18, t: 16, b: 28 };
  const WIDE = window.matchMedia('(min-width: 1024px)');
  function setChartSize() {
    Object.assign(CH, WIDE.matches ? { W: 600, H: 260 } : { W: 320, H: 200 });
    $('#chart').setAttribute('viewBox', `0 0 ${CH.W} ${CH.H}`);
  }
  WIDE.addEventListener('change', () => { setChartSize(); state.chartShown = null; drawChart(false); });
  const COLOR_RAW = '#191D32', COLOR_PSA = '#E70E02';

  // Curva suave (Catmull-Rom convertido a Bézier)
  function smoothPath(pts) {
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  }
  const kfmt = v => (v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + 'k' : String(Math.round(v)));

  // Dibuja el gráfico con unos valores concretos
  function renderChart(raw, psa, labels) {
    const { W, H, l, r, t, b } = CH;
    const all = raw.concat(psa);
    const min = Math.floor(Math.min(...all) * 0.85 / 100) * 100;
    const max = Math.ceil(Math.max(...all) * 1.05 / 100) * 100;
    const x = i => l + (i * (W - l - r)) / (raw.length - 1);
    const y = v => t + (1 - (v - min) / (max - min)) * (H - t - b);
    const ptsRaw = raw.map((v, i) => ({ x: x(i), y: y(v) }));
    const ptsPsa = psa.map((v, i) => ({ x: x(i), y: y(v) }));

    let s = `<defs>
      <linearGradient id="gRaw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COLOR_RAW}" stop-opacity=".18"/><stop offset="1" stop-color="${COLOR_RAW}" stop-opacity="0"/></linearGradient>
      <linearGradient id="gPsa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COLOR_PSA}" stop-opacity=".18"/><stop offset="1" stop-color="${COLOR_PSA}" stop-opacity="0"/></linearGradient>
    </defs>`;
    // Rejilla y eje Y
    for (let i = 0; i <= 4; i++) {
      const v = min + ((max - min) * i) / 4, yy = y(v);
      s += `<line x1="${l}" x2="${W - r}" y1="${yy}" y2="${yy}" stroke="${COLOR_RAW}" stroke-opacity="${i === 0 ? .25 : .07}" ${i === 0 ? '' : 'stroke-dasharray="3 4"'}/>`;
      s += `<text x="${l - 6}" y="${yy + 3}" text-anchor="end" font-size="9" fill="${COLOR_RAW}" fill-opacity=".5" font-family="Inter">${kfmt(v)}€</text>`;
    }
    // Eje X (meses / fechas)
    labels.forEach((lab, i) => {
      if (lab) s += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="9" fill="${COLOR_RAW}" fill-opacity=".55" font-family="Inter">${lab}</text>`;
    });
    // Áreas y líneas
    const bottom = y(min);
    const area = pts => `${smoothPath(pts)} L${pts[pts.length - 1].x},${bottom} L${pts[0].x},${bottom} Z`;
    s += `<path d="${area(ptsPsa)}" fill="url(#gPsa)"/><path d="${area(ptsRaw)}" fill="url(#gRaw)"/>`;
    s += `<path d="${smoothPath(ptsPsa)}" fill="none" stroke="${COLOR_PSA}" stroke-width="2.5" stroke-linecap="round"/>`;
    s += `<path d="${smoothPath(ptsRaw)}" fill="none" stroke="${COLOR_RAW}" stroke-width="2.5" stroke-linecap="round"/>`;
    // Punto final de cada línea con su valor
    [[ptsPsa, psa, COLOR_PSA], [ptsRaw, raw, COLOR_RAW]].forEach(([pts, vals, col]) => {
      const p = pts[pts.length - 1];
      s += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="${col}" fill-opacity=".15"/><circle cx="${p.x}" cy="${p.y}" r="4" fill="#fff" stroke="${col}" stroke-width="2.5"/>`;
      s += `<g transform="translate(${p.x - 8},${p.y - 12})"><rect x="-44" y="-9" width="44" height="16" rx="8" fill="${col}"/>
            <text x="-22" y="2.5" text-anchor="middle" font-size="9" font-weight="600" fill="${col === COLOR_RAW ? '#FAA916' : '#fff'}" font-family="Inter">${fmtEUR(vals[vals.length - 1])}</text></g>`;
    });
    $('#chart').innerHTML = s;
  }

  // Anima el gráfico desde los valores actuales hasta los del rango elegido
  function drawChart(animate = true) {
    const target = detail.chart[state.range];
    $$('.range-btn').forEach(btn => {
      const on = btn.dataset.range === state.range;
      btn.classList.toggle('bg-red1', on);
      btn.classList.toggle('text-white', on);
      btn.classList.toggle('shadow', on);
      btn.classList.toggle('text-dark/60', !on);
      btn.setAttribute('aria-pressed', on);
    });
    const from = state.chartShown;
    const done = () => { state.chartShown = { raw: [...target.raw], psa: [...target.psa] }; };
    if (!animate || REDUCED || !from) { renderChart(target.raw, target.psa, target.labels); return done(); }

    const start = performance.now(), dur = 450;
    const ease = k => 1 - Math.pow(1 - k, 3);
    (function frame(now) {
      const k = ease(Math.min(1, (now - start) / dur));
      const lerp = (a, b) => a.map((v, i) => v + (b[i] - v) * k);
      renderChart(lerp(from.raw, target.raw), lerp(from.psa, target.psa), target.labels);
      if (k < 1) requestAnimationFrame(frame); else done();
    })(start);
  }

  function initRange() {
    $$('.range-btn').forEach(btn => btn.addEventListener('click', () => {
      state.range = btn.dataset.range;
      drawChart(true);
    }));
  }

  /* ---------- Inicio ---------- */
  renderInfo();
  if (requestedId && !getCard(requestedId)) toast('Card not found — showing ' + card.name);
  renderPrice();
  renderSales();
  renderMoreCards();
  setChartSize();
  drawChart(false);
  initHolo();
  initActions();
  initRange();
})();
