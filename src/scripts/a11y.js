/* =========================================================
   Widget de Acessibilidade - Guia do Paciente HSFA
   Fonte +/-, alto contraste, destacar links, reduzir animacoes.
   Preferencias salvas no localStorage.
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const KEY  = 'hsfa-a11y';
  const FONT_STEPS = [16, 18, 20, 22];

  const state = { font: 0, contrast: false, links: false, motion: false };
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
    reflectToggle('a11y-contrast', state.contrast);
    reflectToggle('a11y-links',    state.links);
    reflectToggle('a11y-motion',   state.motion);
  }

  /* ---- abrir / fechar painel ---- */
  function openPanel() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
  }
  function closePanel() {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
  }
  fab.addEventListener('click', () => {
    panel.hidden ? openPanel() : closePanel();
  });
  $('a11y-close') && $('a11y-close').addEventListener('click', () => {
    closePanel(); fab.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) { closePanel(); fab.focus(); }
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
    if (b) b.addEventListener('click', () => {
      state[key] = !state[key]; apply(); save();
    });
  }
  bindToggle('a11y-contrast', 'contrast');
  bindToggle('a11y-links',    'links');
  bindToggle('a11y-motion',   'motion');

  /* ---- restaurar padrao ---- */
  $('a11y-reset') && $('a11y-reset').addEventListener('click', () => {
    state.font = 0;
    state.contrast = false;
    state.links = false;
    state.motion = false;
    apply(); save();
  });

  /* aplica preferencias salvas no carregamento */
  apply();
})();
