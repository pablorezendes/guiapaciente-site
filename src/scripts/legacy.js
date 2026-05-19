/* =========================================================
   GUIA DO PACIENTE — HSFA 2024
   Script principal com i18n, FAQ, Chatbot, PWA, Form
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     I18N — Internacionalização
     ========================================================= */
  const SUPPORTED_LANGS = ['pt', 'en', 'es'];
  let currentLang = 'pt';

  function detectLang() {
    // 1. URL ?lang=xx (prioridade — permite compartilhar links)
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;
    // 2. localStorage (preferência salva pelo usuário)
    const saved = localStorage.getItem('hsfa-lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    // 3. browser (Accept-Language)
    const browser = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(browser)) return browser;
    return 'pt';
  }

  function applyTranslations(lang) {
    if (!window.I18N || !window.I18N[lang]) return;
    const dict = window.I18N[lang];

    // textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    // innerHTML (para conteúdo com <strong>, <br> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) el.innerHTML = dict[key];
    });

    // atributos (placeholder, aria-label)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      const [attr, key] = spec.split('|');
      if (dict[key]) el.setAttribute(attr, dict[key]);
    });

    // Atualiza <html lang>
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;

    // Atualiza botões de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    currentLang = lang;
    localStorage.setItem('hsfa-lang', lang);

    // Dispara evento para outros módulos (FAQ, chatbot)
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function initLangSwitch() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTranslations(btn.dataset.lang);
      });
    });
    applyTranslations(detectLang());
  }

  /* =========================================================
     NAVEGAÇÃO — Menu mobile + scroll spy
     ========================================================= */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll spy
  const sectionIds = ['bem-vindo','internacao','acomodacoes','cirurgia','equipe','alimentacao','seguranca','direitos','contato'];
  const navLinks = sectionIds
    .map(id => document.querySelector(`.nav-menu a[href="#${id}"]`))
    .filter(Boolean);

  if ('IntersectionObserver' in window && navLinks.length) {
    const spyObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-50% 0px -45% 0px' });
    sectionIds.forEach(id => {
      const s = document.getElementById(id);
      if (s) spyObs.observe(s);
    });
  }

  /* =========================================================
     TABS — Acomodações + Direitos
     ========================================================= */
  const accTabs = document.querySelectorAll('.accommodations .tab');
  const accPanels = document.querySelectorAll('.accommodations .tab-panel');
  accTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('aria-controls');
      accTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      accPanels.forEach(p => {
        p.classList.remove('is-active');
        p.hidden = true;
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('is-active');
        panel.hidden = false;
      }
    });
  });

  const rTabs = document.querySelectorAll('.rt');
  const rLists = ['rights-list', 'duties-list'];
  rTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      rTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      rLists.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.hidden = (id !== target);
      });
    });
  });

  /* =========================================================
     ANIMAÇÃO DE ENTRADA (REVEAL)
     ========================================================= */
  const revealSelectors = [
    '.mvv-card','.welcome-text','.specialties','.info-card',
    '.checklist-card','.callout','.rule','.hum-card',
    '.numbered-list li','.s-card','.bring-item','.t-step',
    '.b-card','.team-card','.meals-table','.meal-info article',
    '.finding-card','.r-do','.r-dont','.meta',
    '.rights-list li','.quote','.faq-cat','.ouvidoria-form',
    '.section-title','.section-sub'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(el => el.classList.add('reveal'));

  // Respeitar preferência de movimento reduzido — revela tudo imediatamente
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), idx * 40);
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revObs.observe(el));

    // Fallback de segurança — se após 3s algo ainda não revelou (ex.: PageSpeed,
    // print, ferramenta de captura), revela tudo para não deixar conteúdo invisível
    setTimeout(() => {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }, 3000);
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* =========================================================
     BOTÃO VOLTAR AO TOPO
     ========================================================= */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
  }

  /* =========================================================
     FAQ — Renderização + busca
     ========================================================= */
  function renderFAQ(lang) {
    const container = document.getElementById('faq-container');
    if (!container || !window.FAQ_DATA) return;

    const data = window.FAQ_DATA[lang] || window.FAQ_DATA['pt'];
    container.innerHTML = '';

    data.forEach(cat => {
      const catEl = document.createElement('div');
      catEl.className = 'faq-cat';
      catEl.innerHTML = `
        <div class="faq-cat-head">
          <span class="faq-cat-icon" aria-hidden="true">${cat.icon}</span>
          <span class="faq-cat-title">${escapeHtml(cat.category)}</span>
        </div>
      `;

      cat.questions.forEach(item => {
        const det = document.createElement('details');
        det.className = 'faq-q';
        det.dataset.keywords = [
          item.q.toLowerCase(),
          item.a.toLowerCase(),
          ...(item.keywords || []).map(k => k.toLowerCase())
        ].join(' ');

        const summary = document.createElement('summary');
        summary.textContent = item.q;
        det.appendChild(summary);

        const a = document.createElement('div');
        a.className = 'faq-a';
        a.textContent = item.a;
        det.appendChild(a);

        catEl.appendChild(det);
      });

      container.appendChild(catEl);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[m]);
  }

  function normalize(str) {
    return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function filterFAQ(query) {
    const q = normalize(query.trim());
    const noResults = document.getElementById('faq-no-results');
    let totalVisible = 0;

    document.querySelectorAll('.faq-cat').forEach(cat => {
      let catVisible = 0;
      cat.querySelectorAll('.faq-q').forEach(d => {
        if (!q) {
          d.classList.remove('hidden');
          d.open = false;
          catVisible++;
        } else {
          const haystack = normalize(d.dataset.keywords);
          const match = haystack.includes(q);
          d.classList.toggle('hidden', !match);
          if (match) {
            catVisible++;
            d.open = true;
          }
        }
      });
      cat.classList.toggle('hidden', catVisible === 0);
      totalVisible += catVisible;
    });

    if (noResults) noResults.hidden = totalVisible > 0;
  }

  const faqSearch = document.getElementById('faq-search-input');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => filterFAQ(e.target.value));
  }

  // Renderiza no init e sempre que mudar idioma
  document.addEventListener('langchange', (e) => renderFAQ(e.detail.lang));

  /* =========================================================
     CHATBOT — Assistente virtual
     ========================================================= */
  const chatFab = document.getElementById('chat-fab');
  const chatPanel = document.getElementById('chat-panel');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input-field');
  const chatSend = document.getElementById('chat-send');
  const chatClose = document.querySelector('.chat-close');

  let chatStarted = false;

  function openChat() {
    if (!chatPanel) return;
    chatPanel.classList.add('is-open');
    chatPanel.setAttribute('aria-hidden', 'false');
    chatFab.classList.add('is-open');
    if (!chatStarted) {
      chatStarted = true;
      setTimeout(() => greetUser(), 250);
    }
    setTimeout(() => chatInput && chatInput.focus(), 350);
  }

  function closeChat() {
    if (!chatPanel) return;
    chatPanel.classList.remove('is-open');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatFab.classList.remove('is-open');
  }

  if (chatFab) chatFab.addEventListener('click', () => {
    if (chatPanel.classList.contains('is-open')) closeChat();
    else openChat();
  });
  if (chatClose) chatClose.addEventListener('click', closeChat);

  function addMsg(text, who = 'bot', isHtml = false) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${who}`;
    if (isHtml) msg.innerHTML = text;
    else msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function addTyping() {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
    return t;
  }

  function addSuggestions(items) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-suggestions';

    const dict = (window.I18N && window.I18N[currentLang]) || {};
    const label = document.createElement('div');
    label.className = 'chat-suggestions-label';
    label.textContent = dict['faq.bot.suggestions'] || 'Sugestões de perguntas:';
    wrap.appendChild(label);

    items.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        handleUserQuestion(text);
      });
      wrap.appendChild(btn);
    });
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function greetUser() {
    const dict = (window.I18N && window.I18N[currentLang]) || {};
    addMsg(dict['faq.bot.welcome'] || 'Olá! Como posso ajudar?');

    // Coleta sugestões iniciais (primeira pergunta de cada categoria)
    const faqs = (window.FAQ_DATA && window.FAQ_DATA[currentLang]) || window.FAQ_DATA['pt'];
    const suggestions = faqs.slice(0, 4).map(c => c.questions[0].q);
    setTimeout(() => addSuggestions(suggestions), 400);
  }

  function findBestMatch(query) {
    const faqs = (window.FAQ_DATA && window.FAQ_DATA[currentLang]) || window.FAQ_DATA['pt'];
    const q = normalize(query);
    const tokens = q.split(/\s+/).filter(t => t.length > 2);

    let best = null;
    let bestScore = 0;

    faqs.forEach(cat => {
      cat.questions.forEach(item => {
        const haystack = normalize([
          item.q, item.a, ...(item.keywords || [])
        ].join(' '));

        let score = 0;
        // Match completo
        if (haystack.includes(q)) score += 10;
        // Token match
        tokens.forEach(t => {
          if (haystack.includes(t)) score += 1;
        });
        // Keyword bônus
        (item.keywords || []).forEach(k => {
          if (q.includes(normalize(k))) score += 3;
        });

        if (score > bestScore) {
          bestScore = score;
          best = { item, cat, score };
        }
      });
    });

    return bestScore >= 2 ? best : null;
  }

  function handleUserQuestion(text) {
    if (!text || !text.trim()) return;
    addMsg(text, 'user');
    chatInput.value = '';

    const typing = addTyping();
    setTimeout(() => {
      typing.remove();
      const match = findBestMatch(text);

      if (match) {
        addMsg(match.item.a, 'bot');
        // Sugere perguntas da mesma categoria
        const related = match.cat.questions
          .filter(q => q.q !== match.item.q)
          .slice(0, 2)
          .map(q => q.q);
        if (related.length) {
          setTimeout(() => addSuggestions(related), 500);
        }
      } else {
        const fallback = {
          pt: 'Hmm, não encontrei uma resposta direta. Tente reformular sua pergunta, ou ligue para a central: <strong>(62) 3221-8000</strong>. Você também pode usar o formulário da Ouvidoria.',
          en: 'Hmm, I could not find a direct answer. Try rephrasing, or call: <strong>+55 (62) 3221-8000</strong>. You can also use the Ombudsman form below.',
          es: 'No encontré una respuesta directa. Intente reformular, o llame al: <strong>+55 (62) 3221-8000</strong>.'
        };
        addMsg(fallback[currentLang] || fallback.pt, 'bot', true);
      }
    }, 600);
  }

  if (chatSend) chatSend.addEventListener('click', () => handleUserQuestion(chatInput.value));
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserQuestion(chatInput.value);
      }
    });
  }

  /* =========================================================
     OUVIDORIA — Formulário com webhook
     ========================================================= */
  // Endpoint do webhook — substituir pelo URL real do HSFA
  const OUVIDORIA_WEBHOOK_URL = '/api/ouvidoria'; // TODO: Pablo (TI/HSFA) — substituir pelo endpoint real

  const ouvidoriaForm = document.getElementById('ouvidoria-form');
  if (ouvidoriaForm) {
    ouvidoriaForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('o-submit');
      const feedback = document.getElementById('o-feedback');
      const dict = (window.I18N && window.I18N[currentLang]) || {};

      feedback.className = 'form-feedback';
      feedback.textContent = '';

      // Validação básica
      const data = {
        name: document.getElementById('o-name').value.trim(),
        email: document.getElementById('o-email').value.trim(),
        phone: document.getElementById('o-phone').value.trim(),
        type: document.getElementById('o-type').value,
        sector: document.getElementById('o-sector').value.trim(),
        message: document.getElementById('o-message').value.trim(),
        privacy: document.getElementById('o-privacy').checked,
        language: currentLang,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: location.href
      };

      if (!data.name || !data.email || !data.message || !data.privacy) {
        feedback.className = 'form-feedback error';
        feedback.textContent = dict['feedback.form.error'] || 'Preencha todos os campos obrigatórios.';
        return;
      }

      submitBtn.classList.add('is-sending');
      submitBtn.disabled = true;

      try {
        const response = await fetch(OUVIDORIA_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok && response.status !== 0) {
          throw new Error(`HTTP ${response.status}`);
        }

        feedback.className = 'form-feedback success';
        feedback.textContent = dict['feedback.form.success'] || '✓ Mensagem enviada com sucesso!';
        ouvidoriaForm.reset();
      } catch (err) {
        console.warn('[Ouvidoria] Webhook não configurado ou indisponível:', err);
        // Em modo dev/sem webhook, ainda mostra sucesso simulado
        // Em produção, remover este fallback
        if (OUVIDORIA_WEBHOOK_URL === '/api/ouvidoria') {
          feedback.className = 'form-feedback success';
          feedback.textContent = (dict['feedback.form.success'] || '✓ Mensagem enviada!') + ' (modo demonstração)';
          console.log('[Ouvidoria] Payload simulado:', data);
          ouvidoriaForm.reset();
        } else {
          feedback.className = 'form-feedback error';
          feedback.textContent = dict['feedback.form.error'] || '⚠ Não foi possível enviar. Ligue para (62) 3221-8000.';
        }
      } finally {
        submitBtn.classList.remove('is-sending');
        submitBtn.disabled = false;
      }
    });
  }

  /* =========================================================
     PWA — Service Worker + Install Prompt
     ========================================================= */
  let deferredPrompt = null;
  const installPrompt = document.getElementById('install-prompt');
  const installBtn = document.getElementById('install-btn');
  const installDismiss = document.getElementById('install-dismiss');

  // Registra Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[SW] Registrado, escopo:', reg.scope))
        .catch(err => console.warn('[SW] Falha ao registrar:', err));
    });
  }

  // Captura evento de instalação
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Mostra prompt customizado se o user já interagiu com a página
    const dismissed = localStorage.getItem('hsfa-pwa-dismissed');
    if (dismissed) {
      const ts = parseInt(dismissed, 10);
      // Re-pergunta a cada 7 dias
      if (Date.now() - ts < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Espera 5 segundos antes de mostrar
    setTimeout(() => {
      if (installPrompt && deferredPrompt) {
        installPrompt.hidden = false;
        requestAnimationFrame(() => installPrompt.classList.add('is-visible'));
      }
    }, 5000);
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Instalação:', outcome);
      deferredPrompt = null;
      hideInstallPrompt();
    });
  }

  if (installDismiss) {
    installDismiss.addEventListener('click', () => {
      localStorage.setItem('hsfa-pwa-dismissed', Date.now().toString());
      hideInstallPrompt();
    });
  }

  function hideInstallPrompt() {
    if (!installPrompt) return;
    installPrompt.classList.remove('is-visible');
    setTimeout(() => { installPrompt.hidden = true; }, 400);
  }

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App instalado!');
    hideInstallPrompt();
  });

  /* =========================================================
     INIT
     ========================================================= */
  initLangSwitch();
  renderFAQ(currentLang);

})();
