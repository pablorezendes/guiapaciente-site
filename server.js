/* ============================================================
   Guia do Paciente HSFA - Express server (producao)
   Serve dist/ + API ouvidoria + ADMIN para upload de imagens.
   ============================================================ */

import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

/* override:true -> o .env e sempre a fonte da verdade,
   mesmo que o PM2 tenha injetado um valor antigo via --update-env */
dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
/* confia no proxy reverso (nginx) para req.secure / X-Forwarded-Proto */
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3010;
const HOST = process.env.HOST || '0.0.0.0';
const DIST = path.join(__dirname, 'dist');
const UPLOADS_DIR = path.join(__dirname, 'data', 'uploads');

const ADMIN_PASSWORD       = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_SESSION_HOURS  = parseInt(process.env.ADMIN_SESSION_HOURS || '24', 10);
const IS_PROD              = process.env.NODE_ENV === 'production';

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/* ============================================================
   SLOTS - todas as imagens trocaveis pelo admin
   ============================================================ */
const SLOTS = [
  // Marca
  { name: 'logo',                w: 240,  h: 64,   label: 'Logo HSFA',           group: 'Marca' },
  { name: 'selo-ona',             w: 400,  h: 400,  label: 'Selo ONA',            group: 'Marca' },
  // Hero
  { name: 'hero-bg',              w: 1920, h: 1080, label: 'Fundo do Hero',       group: 'Hero' },
  { name: 'hero-capa',            w: 900,  h: 1200, label: 'Capa do Hero',        group: 'Hero' },
  // Acomodacoes
  { name: 'recepcao',             w: 1400, h: 900,  label: 'Recepcao',            group: 'Acomodacoes' },
  { name: 'enfermaria',           w: 1400, h: 900,  label: 'Enfermaria',          group: 'Acomodacoes' },
  { name: 'apartamento',          w: 1400, h: 900,  label: 'Apartamento',         group: 'Acomodacoes' },
  { name: 'uti',                  w: 1400, h: 900,  label: 'UTI',                 group: 'Acomodacoes' },
  { name: 'uti-humanizada',       w: 1400, h: 900,  label: 'UTI Humanizada',      group: 'Acomodacoes' },
  { name: 'centro-cirurgico',     w: 1400, h: 900,  label: 'Centro Cirurgico',    group: 'Acomodacoes' },
  { name: 'refeitorio',           w: 1400, h: 900,  label: 'Refeitorio',          group: 'Acomodacoes' },
  { name: 'plantao24h',           w: 1400, h: 900,  label: 'Plantao 24h',         group: 'Acomodacoes' },
  // Equipe
  { name: 'equipe-foto',          w: 1400, h: 900,  label: 'Foto institucional',  group: 'Equipe' },
  { name: 'equipe-enfermagem',    w: 800,  h: 800,  label: 'Avatar Enfermagem',   group: 'Equipe' },
  { name: 'equipe-fisioterapia',  w: 800,  h: 800,  label: 'Avatar Fisioterapia', group: 'Equipe' },
  { name: 'equipe-to',            w: 800,  h: 800,  label: 'Avatar TO',           group: 'Equipe' },
  { name: 'equipe-odonto',        w: 800,  h: 800,  label: 'Avatar Odontologia',  group: 'Equipe' },
  { name: 'equipe-servicosocial', w: 800,  h: 800,  label: 'Avatar Servico Social', group: 'Equipe' },
  { name: 'equipe-farmacia',      w: 800,  h: 800,  label: 'Avatar Farmacia',     group: 'Equipe' }
];
const SLOT_NAMES = new Set(SLOTS.map(s => s.name));

/* ============================================================
   AUTH stateless (HMAC) - sem dependencia de DB
   ============================================================ */
const SECRET = crypto
  .createHash('sha256')
  .update(ADMIN_PASSWORD + '::guiapaciente-hsfa::v1')
  .digest();

function signToken(ttlMs) {
  const exp = Date.now() + ttlMs;
  const payload = `${exp}`;
  const mac = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return Buffer.from(`${payload}.${mac}`).toString('base64url');
}
function verifyToken(token) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [exp, mac] = decoded.split('.');
    if (!exp || !mac) return false;
    const expected = crypto.createHmac('sha256', SECRET).update(exp).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false;
    return Date.now() < parseInt(exp, 10);
  } catch { return false; }
}
function adminGuard(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'unauthorized' });
  next();
}

/* ============================================================
   MULTER - upload de imagens
   ============================================================ */
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename:    (req, file, cb) => {
      const slot = req.params.slot;
      const ext = (path.extname(file.originalname).toLowerCase() || '.jpg').replace(/^\./, '');
      const safeExt = ['jpg','jpeg','png','webp'].includes(ext) ? ext : 'jpg';
      // antes de gravar, apaga versoes existentes em outras extensoes
      for (const e of ['jpg','jpeg','png','webp']) {
        const f = path.join(UPLOADS_DIR, `${slot}.${e}`);
        if (fs.existsSync(f)) fs.unlinkSync(f);
      }
      cb(null, `${slot}.${safeExt}`);
    }
  }),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Tipo de arquivo nao suportado (use JPG, PNG ou WEBP)'));
    }
    cb(null, true);
  }
});

function getUploadedFile(slot) {
  for (const ext of ['jpg','jpeg','png','webp']) {
    const f = path.join(UPLOADS_DIR, `${slot}.${ext}`);
    if (fs.existsSync(f)) return { path: f, ext };
  }
  return null;
}

/* ============================================================
   MIDDLEWARES GLOBAIS
   ============================================================ */
app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* CSP - same-origin + VLibras (tradutor de Libras do Gov Federal).
   O VLibras carrega de vlibras.gov.br (script, assets, avatar 3D). */
const VLIBRAS = 'https://vlibras.gov.br';
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src':  ["'self'"],
      'script-src':   ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'", VLIBRAS],
      'style-src':    ["'self'", "'unsafe-inline'", VLIBRAS],
      'font-src':     ["'self'", 'data:', VLIBRAS],
      'img-src':      ["'self'", 'data:', 'blob:', 'https:'],
      'connect-src':  ["'self'", VLIBRAS],
      'worker-src':   ["'self'", 'blob:'],
      'frame-src':    ["'self'", VLIBRAS],
      'manifest-src': ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

/* ============================================================
   HEALTH
   ============================================================ */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'guiapaciente-site',
    version: '2.1.0',
    uptime_s: Math.round(process.uptime())
  });
});

/* ============================================================
   OUVIDORIA (webhook simples)
   ============================================================ */
app.post('/api/ouvidoria', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log('[OUVIDORIA]', new Date().toISOString(), {
      type:    payload.type,
      sector:  payload.sector,
      name:    payload.name,
      email:   payload.email
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[OUVIDORIA] erro:', err);
    res.status(500).json({ ok: false, error: 'internal' });
  }
});

/* ============================================================
   ADMIN - auth
   ============================================================ */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ ok: false, error: 'missing_password' });
  }
  const ok = crypto.timingSafeEqual(
    Buffer.from(password.padEnd(64, '\0').slice(0, 64)),
    Buffer.from(ADMIN_PASSWORD.padEnd(64, '\0').slice(0, 64))
  ) && password === ADMIN_PASSWORD;
  if (!ok) return res.status(401).json({ ok: false, error: 'invalid_password' });

  const ttlMs = ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  const token = signToken(ttlMs);
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure:   req.secure,   /* Secure so quando a requisicao veio por HTTPS */
    sameSite: 'lax',
    maxAge:   ttlMs,
    path:     '/'
  });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token', { path: '/', secure: req.secure, sameSite: 'lax' });
  res.json({ ok: true });
});

app.get('/api/admin/me', (req, res) => {
  res.json({ authenticated: verifyToken(req.cookies?.admin_token) });
});

/* ============================================================
   ADMIN - slots
   ============================================================ */
app.get('/api/admin/slots', adminGuard, (_req, res) => {
  const data = SLOTS.map(s => {
    const uploaded = getUploadedFile(s.name);
    return {
      ...s,
      uploaded: !!uploaded,
      uploadedExt: uploaded?.ext || null,
      uploadedAt:  uploaded ? fs.statSync(uploaded.path).mtimeMs : null,
      // url com cache-buster
      previewUrl: `/img/${s.name}.${uploaded?.ext || 'svg'}?v=${Date.now()}`
    };
  });
  res.json({ ok: true, slots: data });
});

app.post('/api/admin/upload/:slot', adminGuard, (req, res) => {
  const { slot } = req.params;
  if (!SLOT_NAMES.has(slot)) {
    return res.status(400).json({ ok: false, error: 'invalid_slot' });
  }
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
    if (!req.file) return res.status(400).json({ ok: false, error: 'no_file' });
    res.json({
      ok: true,
      slot,
      filename: req.file.filename,
      size:     req.file.size
    });
  });
});

app.delete('/api/admin/upload/:slot', adminGuard, (req, res) => {
  const { slot } = req.params;
  if (!SLOT_NAMES.has(slot)) {
    return res.status(400).json({ ok: false, error: 'invalid_slot' });
  }
  const uploaded = getUploadedFile(slot);
  if (uploaded) fs.unlinkSync(uploaded.path);
  res.json({ ok: true });
});

/* ============================================================
   MIDDLEWARE - serve uploads em /img/* (override do default)
   /img/hero-capa.svg -> data/uploads/hero-capa.jpg (se existir)
   ============================================================ */
app.use((req, res, next) => {
  const m = req.path.match(/^\/img\/([^./]+)\.(svg|jpg|jpeg|png|webp)$/i);
  if (!m) return next();
  const base = m[1];
  if (!SLOT_NAMES.has(base)) return next();
  const uploaded = getUploadedFile(base);
  if (!uploaded) return next();
  /* no-cache: o navegador revalida sempre (304 se nao mudou).
     Garante que a troca de imagem pelo admin apareça na hora. */
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Img-Source', 'upload');
  res.sendFile(uploaded.path);
});

/* ============================================================
   INDEX DINAMICO - injeta a versao atual das imagens
   imgVersion() = data do upload mais recente. A cada troca de
   foto pelo admin a versao muda, entao as URLs /img/*?v=N
   mudam e NENHUM cache (navegador, service worker, Cloudflare)
   serve imagem velha - porque a URL passa a ser nova.
   ============================================================ */
function imgVersion() {
  try {
    let max = 0;
    for (const f of fs.readdirSync(UPLOADS_DIR)) {
      const m = fs.statSync(path.join(UPLOADS_DIR, f)).mtimeMs;
      if (m > max) max = m;
    }
    return max ? String(Math.round(max)) : 'b3';
  } catch {
    return 'b3';
  }
}

function serveIndex(_req, res) {
  try {
    let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
    html = html.replace(/\?v=3"/g, `?v=${imgVersion()}"`);
    res.set('Cache-Control', 'no-cache');
    res.type('html').send(html);
  } catch {
    res.status(500).send('Erro ao carregar a pagina.');
  }
}

app.get('/', serveIndex);
app.get('/index.html', serveIndex);

/* ============================================================
   STATIC (dist) - index desativado (controlado por serveIndex)
   ============================================================ */
app.use(express.static(DIST, {
  index:       false,
  etag:        true,
  lastModified:true,
  maxAge:      '7d',
  setHeaders(res, file) {
    const norm = file.replace(/\\/g, '/');
    if (file.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (norm.includes('/admin/')) {
      /* admin e ferramenta interna - sempre fresco */
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (norm.includes('/img/')) {
      /* imagens podem ser trocadas pelo admin - sempre revalida */
      res.setHeader('Cache-Control', 'no-cache');
    } else if (file.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

/* SPA fallback */
app.get('*', (req, res) => {
  if (req.path.startsWith('/admin')) {
    const adminIndex = path.join(DIST, 'admin', 'index.html');
    if (fs.existsSync(adminIndex)) return res.sendFile(adminIndex);
  }
  serveIndex(req, res);
});

/* ============================================================
   START
   ============================================================ */
app.listen(PORT, HOST, () => {
  console.log(`Guia do Paciente HSFA rodando em http://${HOST}:${PORT}`);
  console.log(`Admin em /admin - senha configurada: ${
    ADMIN_PASSWORD && ADMIN_PASSWORD !== 'admin'
      ? `sim (${ADMIN_PASSWORD.length} caracteres)`
      : 'NAO (usando default "admin" - configure ADMIN_PASSWORD no .env)'
  }`);
});
