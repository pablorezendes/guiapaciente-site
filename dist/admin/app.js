/* =========================================================
   ADMIN - Guia do Paciente HSFA
   ========================================================= */
(function () {
  'use strict';

  const $        = (sel, ctx = document) => ctx.querySelector(sel);
  const $$       = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const screens  = { login: $('#screen-login'), dash: $('#screen-dash') };
  const grid     = $('#grid');
  const counter  = $('#counter');
  const toastEl  = $('#toast');

  let currentGroup = 'all';
  let slots = [];

  /* ---------- TOAST ---------- */
  function toast(msg, kind = 'info', ms = 3000) {
    toastEl.className = `toast ${kind}`;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => (toastEl.hidden = true), 400);
    }, ms);
  }

  /* ---------- FETCH helpers ---------- */
  async function api(path, opts = {}) {
    const res = await fetch(path, {
      credentials: 'same-origin',
      ...opts,
      headers: { Accept: 'application/json', ...(opts.headers || {}) }
    });
    let data = {};
    try { data = await res.json(); } catch {}
    return { ok: res.ok, status: res.status, data };
  }

  /* ---------- AUTH ---------- */
  async function checkAuth() {
    const { data } = await api('/api/admin/me');
    return data.authenticated === true;
  }

  async function login(password) {
    const { ok, status, data } = await api('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password })
    });
    if (!ok) {
      const err = status === 401 ? 'Senha incorreta.' : (data.error || 'Erro ao entrar.');
      throw new Error(err);
    }
  }

  async function logout() {
    await api('/api/admin/logout', { method: 'POST' });
    showScreen('login');
    toast('Sessão encerrada', 'info');
    $('#pwd').value = '';
  }

  /* ---------- SCREENS ---------- */
  function showScreen(name) {
    /* display inline vence qualquer CSS - independe de style.css atualizado */
    screens.login.style.display = name === 'login' ? 'grid' : 'none';
    screens.dash.style.display  = name === 'dash'  ? 'grid' : 'none';
    screens.login.hidden = name !== 'login';
    screens.dash.hidden  = name !== 'dash';
  }

  /* ---------- SLOTS LIST ---------- */
  async function loadSlots() {
    const { ok, data } = await api('/api/admin/slots');
    if (!ok) {
      toast('Erro ao carregar imagens', 'err');
      return;
    }
    slots = data.slots || [];
    renderGrid();
    updateCounter();
  }

  function renderGrid() {
    const filtered = currentGroup === 'all'
      ? slots
      : slots.filter(s => s.group === currentGroup);

    grid.innerHTML = filtered.map(s => `
      <article class="card" data-slot="${s.name}">
        <div class="card-img">
          <span class="card-tag ${s.uploaded ? 'custom' : 'default'}">${s.uploaded ? 'Personalizada' : 'Padrão'}</span>
          <img src="${s.previewUrl}" alt="${s.label}" loading="lazy">
        </div>
        <div class="card-body">
          <h4 class="card-title">${s.label}</h4>
          <p class="card-meta">${s.w} × ${s.h}px · <code>${s.name}</code></p>
        </div>
        <div class="card-actions">
          <label class="btn btn-up">
            <span>↑ Enviar</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" data-slot="${s.name}">
          </label>
          <button class="btn btn-reset" data-reset="${s.name}" ${s.uploaded ? '' : 'disabled'} title="Voltar ao padrão">
            ↺
          </button>
        </div>
      </article>
    `).join('');

    /* bind upload */
    $$('input[type="file"][data-slot]', grid).forEach(input => {
      input.addEventListener('change', onUpload);
    });
    /* bind reset */
    $$('button[data-reset]', grid).forEach(btn => {
      btn.addEventListener('click', () => onReset(btn.dataset.reset));
    });
  }

  function updateCounter() {
    const total  = slots.length;
    const custom = slots.filter(s => s.uploaded).length;
    counter.textContent = `${custom} / ${total} personalizadas`;
  }

  /* ---------- UPLOAD ---------- */
  async function onUpload(ev) {
    const input = ev.target;
    const slot  = input.dataset.slot;
    const file  = input.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast(`"${file.name}" tem mais de 10 MB`, 'err');
      input.value = '';
      return;
    }

    const card = grid.querySelector(`.card[data-slot="${slot}"]`);
    card?.classList.add('is-uploading');

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`/api/admin/upload/${slot}`, {
        method: 'POST',
        body:   fd,
        credentials: 'same-origin'
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Falha no envio');

      toast(`✓ "${slot}" atualizada`, 'ok');
      await loadSlots();
    } catch (e) {
      toast(e.message || 'Erro no upload', 'err');
    } finally {
      card?.classList.remove('is-uploading');
      input.value = '';
    }
  }

  async function onReset(slot) {
    if (!confirm(`Restaurar a imagem padrão de "${slot}"?\nO arquivo enviado será removido.`)) return;
    try {
      const res = await fetch(`/api/admin/upload/${slot}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      if (!res.ok) throw new Error('Falha ao restaurar');
      toast(`↺ "${slot}" voltou ao padrão`, 'info');
      await loadSlots();
    } catch (e) {
      toast(e.message, 'err');
    }
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    /* login form */
    $('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const err = $('#login-err');
      err.hidden = true;
      btn.classList.add('is-loading');
      btn.disabled = true;
      try {
        await login($('#pwd').value);
        showScreen('dash');
        await loadSlots();
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
      } finally {
        btn.classList.remove('is-loading');
        btn.disabled = false;
      }
    });

    /* logout */
    $('#logout-btn').addEventListener('click', logout);

    /* filters */
    $$('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentGroup = chip.dataset.group;
        renderGrid();
      });
    });

    /* auto-login if cookie still valid */
    if (await checkAuth()) {
      showScreen('dash');
      await loadSlots();
    } else {
      showScreen('login');
    }
  });
})();
