/* =========================================================
   GUIA DO PACIENTE — HSFA 2024
   Service Worker — Cache offline
   ========================================================= */

const CACHE_VERSION = 'hsfa-guia-v2.6.0';
const CACHE_NAME = `${CACHE_VERSION}-static`;

// Recursos essenciais - pre-cacheados na instalacao.
// Imagens NAO entram aqui: podem ser trocadas pelo admin a qualquer momento.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/fonts/fonts.css',
  '/fonts/manrope-latin.woff2',
  '/fonts/inter-latin.woff2'
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

  // SO processa requisicoes do proprio site. Cross-origin (Kaspersky,
  // Cloudflare beacon, analytics) passa direto sem o SW interferir.
  if (url.origin !== self.location.origin) return;

  // ADMIN e API: sempre rede, NUNCA cache (ferramenta interna)
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) {
    return;
  }

  // POST do formulário de ouvidoria — passa direto sem cache
  if (request.url.includes('webhook') || request.url.includes('formspree') || request.url.includes('formsubmit')) {
    return;
  }

  // NAVEGACAO (documento HTML): network-first.
  // O HTML carrega a CSP e a versao das imagens - precisa estar
  // sempre fresco. Cai pro cache so quando offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          return (await caches.match(request)) ||
                 (await caches.match('/index.html')) ||
                 Response.error();
        })
    );
    return;
  }

  // IMAGENS (/img/*): network-first com bypass do cache HTTP.
  // cache:'reload' ignora versoes velhas guardadas pelo navegador -
  // garante que uploads do admin aparecam na hora.
  if (url.pathname.startsWith('/img/')) {
    event.respondWith(
      fetch(request, { cache: 'reload' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || Response.error();
        })
    );
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
        .catch(async () => {
          // Offline + sem cache: tenta servir pagina principal para navegacoes
          if (request.mode === 'navigate') {
            const fallback = await caches.match('/index.html');
            if (fallback) return fallback;
          }
          // nunca retorna undefined - respondWith exige um Response
          return cachedResponse || Response.error();
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
