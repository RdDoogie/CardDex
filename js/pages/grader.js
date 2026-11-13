/* ==================================================================
   CardDex · pages/grader.js
   AI Card Grader (simulado): vista previa local de Front/Back,
   escaneo animado, barras de progreso y tarjeta de resultado.
   No hay IA real: los valores son de ejemplo (DATA.grader).
   ================================================================== */
(function () {
  const gradeBtn = $('#gradeBtn'), result = $('#gradeResult');
  const { criteria } = DATA.grader;

  // Estado de esta página
  const state = { front: null, back: null, grading: false };

  /* ---------- Huecos Front / Back ---------- */
  const emptySlotHTML = label => `
    <span class="flex flex-col items-center gap-2 text-dark/45 px-2 text-center">
      <span class="w-10 h-10 rounded-full bg-white shadow-soft grid place-items-center text-red1"><span class="w-5 h-5">${svgIcon('upload')}</span></span>
      <span class="text-[11px] font-medium leading-tight">Tap to add<br>${label} image</span>
    </span>`;

  function renderSlot(side) {
    const slot = $(`#${side}Slot`), data = state[side];
    if (!data) { slot.innerHTML = emptySlotHTML(side); return; }
    slot.innerHTML = (data.sampleId
      ? cardImg(getCard(data.sampleId), 'absolute inset-0 w-full h-full object-cover', false)
      : `<img src="${data.src}" alt="${side} of your card" class="absolute inset-0 w-full h-full object-cover">`)
      + '<span class="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-dark/80 text-white text-[10px] font-semibold px-2 py-0.5">Change</span>';
  }

  /* ---------- Botón principal ---------- */
  function resetGradeBtn() {
    gradeBtn.innerHTML = `<span class="w-5 h-5">${svgIcon('sparkles')}</span><span>Submit for AI Grading</span>`;
    gradeBtn.classList.remove('hidden');
    gradeBtn.disabled = !state.front; // desactivado hasta tener al menos la imagen frontal
  }

  function setLoadingBtn() {
    gradeBtn.disabled = true;
    gradeBtn.innerHTML = `<svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".3" stroke-width="3"/><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span>Analyzing...</span>`;
  }

  /* ---------- Barras de progreso ---------- */
  function renderBars() {
    $('#bars').innerHTML = criteria.map(c => `
      <div>
        <div class="flex justify-between text-sm"><span class="font-semibold">${c}</span><span class="tabular-nums font-semibold text-dark/70" id="val-${c}">0 %</span></div>
        <div class="mt-1.5 h-2.5 rounded-full bg-dark/[.07] overflow-hidden" role="progressbar" aria-label="${c}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pb-${c}">
          <div class="bar-fill h-full w-0 rounded-full bg-gradient-to-r from-red2 to-red1" id="bar-${c}"></div>
        </div>
      </div>`).join('');
  }

  function setBar(c, value) {
    $(`#bar-${c}`).style.width = value + '%';
    $(`#pb-${c}`).setAttribute('aria-valuenow', value);
  }

  function resetBars() {
    criteria.forEach(c => { setBar(c, 0); $(`#val-${c}`).textContent = '0 %'; });
  }

  // Animación del número (0 → valor)
  function countUp(el, to, dur = 700) {
    const start = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + ' %';
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- Imágenes ---------- */
  function setImage(side, value) {
    if (state.grading) return;
    if (state[side]?.src?.startsWith('blob:')) URL.revokeObjectURL(state[side].src); // libera memoria
    state[side] = value;
    renderSlot(side);
    resetBars();
    result.classList.add('hidden');
    resetGradeBtn();
  }

  /* ---------- Cálculo del resultado ---------- */
  // Aleatorio pero realista: primero se decide el estado general de la carta
  // (la mayoría de cartas que se envían a graduar están casi perfectas) y
  // después cada criterio varía un poco alrededor de ese estado.
  const between = (a, b) => a + Math.random() * (b - a);
  function getScores() {
    const r = Math.random();
    const base = r < .15 ? between(95, 99)    // pack fresh
               : r < .55 ? between(90, 96)    // casi perfecta
               : r < .85 ? between(84, 91)    // pequeños defectos
               :           between(70, 85);   // jugada / con desgaste
    return Object.fromEntries(criteria.map(c => {
      const v = base + between(-1, 1) * DATA.grader.spread[c];
      return [c, Math.max(50, Math.min(100, Math.round(v)))];
    }));
  }

  // Como en PSA, la nota la limita sobre todo el criterio más flojo
  function computeGrade(scores) {
    const vals = Object.values(scores);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const overall = avg * .55 + Math.min(...vals) * .45;
    const steps = [[96, 10], [91, 9], [86, 8], [80, 7], [74, 6], [68, 5], [62, 4]];
    const grade = (steps.find(([min]) => overall >= min) || [0, 3])[1];
    return { grade, overall };
  }

  function showResult(scores) {
    const { grade, overall } = computeGrade(scores);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [best, worst] = [sorted[0], sorted[sorted.length - 1]];
    $('#gradeValue').textContent = grade;
    $('#gradeLabel').textContent = DATA.grader.labels[grade];
    const score = `Overall score ${overall.toFixed(1).replace('.', ',')} / 100. `;
    $('#gradeSummary').textContent = grade === 10
      ? `${score}Every criterion is at ${worst[1]} % or higher — a strong Gem Mint candidate. Submit it to PSA with confidence.`
      : grade >= 8
        ? `${score}Strongest point: ${best[0].toLowerCase()} (${best[1]} %). ${worst[0]} (${worst[1]} %) is what keeps it from a higher grade — worth checking before you submit it to PSA.`
        : `${score}${worst[0]} (${worst[1]} %) shows visible wear. Grading may not be worth the fee unless the card is valuable — consider keeping it raw.`;
    result.classList.remove('hidden', 'screen-enter');
    void result.offsetWidth;
    result.classList.add('screen-enter');
    result.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- Proceso de "AI grading" ---------- */
  async function grade() {
    if (!state.front || state.grading) return;
    state.grading = true;
    setLoadingBtn();
    resetBars();
    result.classList.add('hidden');

    // 1) Línea de escaneo sobre las imágenes ~2 s
    const slots = ['front', 'back'].filter(s => state[s]).map(s => $(`#${s}Slot`));
    slots.forEach(s => s.insertAdjacentHTML('beforeend', '<div class="scan-overlay"></div>'));
    await wait(2000);
    slots.forEach(s => s.querySelector('.scan-overlay')?.remove());

    // 2) Las barras se rellenan una tras otra
    const scores = getScores();
    for (const c of criteria) {
      setBar(c, scores[c]);
      countUp($(`#val-${c}`), scores[c]);
      await wait(550);
    }
    await wait(300);

    // 3) Resultado
    showResult(scores);
    state.grading = false;
    gradeBtn.classList.add('hidden'); // la acción ahora es "Grade another card"
  }

  function resetGrader() {
    setImage('front', null);
    setImage('back', null);
    $('#main').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ---------- Eventos ---------- */
  function initEvents() {
    ['front', 'back'].forEach(side => {
      $(`#${side}Input`).addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) setImage(side, { src: URL.createObjectURL(file) }); // vista previa local
        e.target.value = '';
      });
    });
    // Carta de ejemplo: una carta aleatoria de la colección (distinta de la anterior) + su reverso
    let lastSampleId = null;
    $('#sampleBtn').addEventListener('click', () => {
      if (state.grading) return;
      const options = DATA.cards.filter(c => c.id !== lastSampleId);
      const card = options[Math.floor(Math.random() * options.length)];
      lastSampleId = card.id;
      setImage('front', { sampleId: card.id });
      setImage('back', { src: DATA.grader.cardBack });
      toast(`Sample card loaded: ${card.name} (front & back)`, 'success');
    });
    gradeBtn.addEventListener('click', grade);
    $('#resetGrade').addEventListener('click', resetGrader);
  }

  /* ---------- Inicio ---------- */
  renderSlot('front');
  renderSlot('back');
  renderBars();
  resetGradeBtn();
  initEvents();
})();
