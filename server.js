/* ============================================================
   Guia do Paciente HSFA - Express server (producao)
   Serve a pasta dist/ gerada pelo Vite, espelhando hsfasaude.
   ============================================================ */

import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3010;
const HOST = process.env.HOST || '0.0.0.0';
const DIST = path.join(__dirname, 'dist');

/* --------- middlewares globais --------- */
app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true }));

/* CSP relaxado para fontes e service-worker */
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src':  ["'self'"],
      'script-src':   ["'self'", "'unsafe-inline'"],
      'style-src':    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src':     ["'self'", 'https://fonts.gstatic.com', 'data:'],
      'img-src':      ["'self'", 'data:', 'blob:', 'https:'],
      'connect-src':  ["'self'", 'https:'],
      'worker-src':   ["'self'"],
      'manifest-src': ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

/* --------- health --------- */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'guiapaciente-site',
    version: '2.0.0',
    uptime_s: Math.round(process.uptime())
  });
});

/* --------- webhook simples da ouvidoria (opcional) --------- */
app.post('/api/ouvidoria', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('[OUVIDORIA]', new Date().toISOString(), {
      type:    payload.type,
      sector:  payload.sector,
      name:    payload.name,
      email:   payload.email
    });
    /* aqui voce pode encaminhar para email/SendGrid/Webhook real */
    res.json({ ok: true });
  } catch (err) {
    console.error('[OUVIDORIA] erro:', err);
    res.status(500).json({ ok: false, error: 'internal' });
  }
});

/* --------- static (dist + SPA fallback) --------- */
app.use(express.static(DIST, {
  etag:        true,
  lastModified:true,
  maxAge:      '7d',
  setHeaders(res, file) {
    if (file.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    if (file.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

/* SPA fallback */
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

/* --------- start --------- */
app.listen(PORT, HOST, () => {
  console.log(`Guia do Paciente HSFA rodando em http://${HOST}:${PORT}`);
});
