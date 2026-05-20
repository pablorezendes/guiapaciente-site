/* =========================================================
   GUIA DO PACIENTE — HSFA 2024
   Service Worker — Cache offline
   ========================================================= */

const CACHE_VERSION = 'hsfa-guia-v2.2.0';
const CACHE_NAME = `${CACHE_VERSION}-static`;

// Recursos essenciais - pre-cacheados na instalacao.
// (O Vite gera hash em /assets/*; o stale-while-revalidate cuida do resto.)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/img/icon.svg',
  '/img/hero-capa.svg',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap'
];

/* ---------- INSTALL ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pré-cacheando recursos...');
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Alguns recursos falharam ao cachear:', err);
        // Cache individual para não falhar tudo
        return Promise.all(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(e => console.warn('[SW] Falha:', url, e.message))
          )
        );
      });
    })
  );
  self.skipWaiting();
});

/* ---------- ACTIVATE — limpa caches antigos ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log('[SW] Removendo cache antigo:', k);
            return caches.delete(k);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/* ---------- FETCH — estratégia stale-while-revalidate ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Só processa GET
  if (request.method !== 'GET') return;

  // Ignora chrome-extension://, data:, etc.
  const url = new URL(request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // ADMIN e API: sempre rede, NUNCA cache (ferramenta interna)
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) {
    return;
  }

  // POST do formulário de ouvidoria — passa direto sem cache
  if (request.url.includes('webhook') || request.url.includes('formspree') || request.url.includes('formsubmit')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Stale-while-revalidate: serve do cache e atualiza em background
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          // Só cacheia respostas válidas
          if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline + sem cache: tenta servir página principal para navegações
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return cachedResponse;
        });

      return cachedResponse || networkFetch;
    })
  );
});

/* ---------- MENSAGEM (forçar atualização) ---------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
