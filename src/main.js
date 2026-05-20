/* =========================================================
   Entry point Vite - Guia do Paciente HSFA
   Importa estilos + scripts existentes (window.I18N, window.FAQ...)
   ========================================================= */

import './styles/main.css';
import './scripts/i18n.js';
import './scripts/faq-data.js';
import './scripts/legacy.js';   /* ja registra o service worker em /sw.js */
import './scripts/reveal.js';
import './scripts/a11y.js';     /* widget de acessibilidade */
