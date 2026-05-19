/* =========================================================
   Scroll reveal + counters (puro IntersectionObserver)
   ========================================================= */

(function () {
  'use strict';

  /* --- reveal --- */
  const els = document.querySelectorAll('[data-reveal]');
  if (els.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }

  /* --- counters --- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = parseFloat(el.getAttribute('data-counter')) || 0;
        const dur    = 1400;
        const start  = performance.now();
        const startV = 0;
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.round(startV + (target - startV) * eased);
          el.textContent = val.toLocaleString('pt-BR');
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io2.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io2.observe(el));
  }

  /* --- header scrolled state --- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
