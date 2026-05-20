/* =========================================================
   Widget de Acessibilidade - Guia do Paciente HSFA
   Fonte +/-, alto contraste, destacar links, reduzir animacoes
   e leitura em voz alta (text-to-speech). Salvo no localStorage.
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const KEY  = 'hsfa-a11y';
  const FONT_STEPS = [16, 18, 20, 22];
  const SPEECH = 'speechSynthesis' in window;

  const state = { font: 0, contrast: false, links: false, motion: false, read: false };
  try {
    Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}'));
  } catch (e) { /* ignora */ }

  const $ = (id) => document.getElementById(id);
  const fab   = $('a11y-fab');
  const panel = $('a11y-panel');
  if (!fab || !panel) return;

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function reflectToggle(id, on) {
    const b = $(id);
    if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function apply() {
    root.style.fontSize = FONT_STEPS[state.font] + 'px';
    root.classList.toggle('a11y-contrast', state.contrast);
    root.classList.toggle('a11y-links',    state.links);
    root.classList.toggle('a11y-motion',   state.motion);
    root.classList.toggle('a11y-read',     state.read);
    reflectToggle('a11y-contrast', state.contrast);
    reflectToggle('a11y-links',    state.links);
    reflectToggle('a11y-motion',   state.motion);
    reflectToggle('a11y-read',     state.read);
    const hint = $('a11y-read-hint');
    if (hint) hint.hidden = !state.read;
    if (!state.read) stopSpeech();
  }

  /* ---- leitura em voz alta ---- */
  function stopSpeech() {
    if (SPEECH) speechSynthesis.cancel();
    document.querySelectorAll('.a11y-reading')
      .forEach((e) => e.classList.remove('a11y-reading'));
  }
  function speechLang() {
    let l = 'pt';
    try { l = localStorage.getItem('hsfa-lang') || root.lang || 'pt'; }
    catch (e) { l = root.lang || 'pt'; }
    l = l.slice(0, 2).toLowerCase();
    return l === 'en' ? 'en-US' : l === 'es' ? 'es-ES' : 'pt-BR';
  }
  function readEl(el) {
    if (!SPEECH) return;
    const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    stopSpeech();
    el.classList.add('a11y-reading');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang();
    u.rate = 1;
    u.onend = u.onerror = () => el.classList.remove('a11y-reading');
    speechSynthesis.speak(u);
  }
  /* no modo leitura, clicar num texto le em voz alta */
  document.addEventListener('click', (e) => {
    if (!state.read) return;
    if (e.target.closest('#a11y')) return;
    const el = e.target.closest(
      'p, h1, h2, h3, h4, h5, h6, li, summary, figcaption, blockquote, .lead, .section-sub, td'
    );
    if (el) readEl(el);
  });

  /* ---- abrir / fechar painel ---- */
  function openPanel()  { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); }
  function closePanel() { panel.hidden = true;  fab.setAttribute('aria-expanded', 'false'); }
  fab.addEventListener('click', () => { panel.hidden ? openPanel() : closePanel(); });
  $('a11y-close') && $('a11y-close').addEventListener('click', () => { closePanel(); fab.focus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      stopSpeech();
      if (!panel.hidden) { closePanel(); fab.focus(); }
    }
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !fab.contains(e.target)) {
      closePanel();
    }
  });

  /* ---- tamanho da fonte ---- */
  $('a11y-font-up') && $('a11y-font-up').addEventListener('click', () => {
    state.font = Math.min(FONT_STEPS.length - 1, state.font + 1); apply(); save();
  });
  $('a11y-font-down') && $('a11y-font-down').addEventListener('click', () => {
    state.font = Math.max(0, state.font - 1); apply(); save();
  });
  $('a11y-font-reset') && $('a11y-font-reset').addEventListener('click', () => {
    state.font = 0; apply(); save();
  });

  /* ---- toggles ---- */
  function bindToggle(id, key) {
    const b = $(id);
    if (b) b.addEventListener('click', () => { state[key] = !state[key]; apply(); save(); });
  }
  bindToggle('a11y-contrast', 'contrast');
  bindToggle('a11y-links',    'links');
  bindToggle('a11y-motion',   'motion');
  bindToggle('a11y-read',     'read');

  /* esconde o leitor de voz se o navegador nao suportar */
  if (!SPEECH) {
    const rb = $('a11y-read');
    if (rb) rb.hidden = true;
    state.read = false;
  }

  /* ---- restaurar padrao ---- */
  $('a11y-reset') && $('a11y-reset').addEventListener('click', () => {
    state.font = 0;
    state.contrast = false;
    state.links = false;
    state.motion = false;
    state.read = false;
    apply(); save();
  });

  /* aplica preferencias salvas no carregamento */
  apply();
})();
