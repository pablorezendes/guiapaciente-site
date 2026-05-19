/* ============================================================
   Gera placeholders SVG nomeados em public/img/
   Cada slot vira um SVG autoexplicativo: nome, dimensao recomendada
   e instrucao de troca. Basta substituir o arquivo pelo seu .jpg/.png
   mantendo o mesmo nome.
   ============================================================ */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, '..', 'public', 'img');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const SLOTS = [
  { file: 'hero-bg.jpg',           w: 1920, h: 1080, label: 'Fundo do Hero',           hint: 'Fachada / interior do HSFA', tone: 'dark'  },
  { file: 'hero-capa.jpg',          w:  900, h: 1200, label: 'Capa do Hero',            hint: 'Imagem destaque (vertical)', tone: 'light' },
  { file: 'recepcao.jpg',           w: 1400, h:  900, label: 'Recepcao',                hint: 'Foto da recepcao principal', tone: 'light' },
  { file: 'enfermaria.jpg',         w: 1400, h:  900, label: 'Enfermaria',              hint: 'Sala de enfermaria',         tone: 'light' },
  { file: 'apartamento.jpg',        w: 1400, h:  900, label: 'Apartamento',             hint: 'Apartamento individual',     tone: 'light' },
  { file: 'uti.jpg',                w: 1400, h:  900, label: 'UTI',                     hint: 'UTI tradicional',            tone: 'dark'  },
  { file: 'uti-humanizada.jpg',     w: 1400, h:  900, label: 'UTI Humanizada',          hint: 'UTI com poltrona',           tone: 'light' },
  { file: 'centro-cirurgico.jpg',   w: 1400, h:  900, label: 'Centro Cirurgico',        hint: 'Sala cirurgica',             tone: 'dark'  },
  { file: 'refeitorio.jpg',         w: 1400, h:  900, label: 'Refeitorio',              hint: 'Refeitorio do subsolo',      tone: 'light' },
  { file: 'plantao24h.jpg',         w: 1400, h:  900, label: 'Plantao 24h',             hint: 'Pronto socorro / fachada',   tone: 'dark'  },
  { file: 'equipe-foto.jpg',        w: 1400, h:  900, label: 'Equipe HSFA',             hint: 'Foto do time multidisciplinar', tone: 'light' },
  { file: 'equipe-enfermagem.jpg',  w:  800, h:  800, label: 'Enfermagem',              hint: 'Avatar / foto profissional', tone: 'light' },
  { file: 'equipe-fisioterapia.jpg',w:  800, h:  800, label: 'Fisioterapia',            hint: 'Avatar / foto profissional', tone: 'light' },
  { file: 'equipe-to.jpg',          w:  800, h:  800, label: 'Terapia Ocupacional',     hint: 'Avatar / foto profissional', tone: 'light' },
  { file: 'equipe-odonto.jpg',      w:  800, h:  800, label: 'Odontologia Hospitalar',  hint: 'Avatar / foto profissional', tone: 'light' },
  { file: 'equipe-servicosocial.jpg',w: 800, h:  800, label: 'Servico Social',          hint: 'Avatar / foto profissional', tone: 'light' },
  { file: 'equipe-farmacia.jpg',    w:  800, h:  800, label: 'Farmacia Clinica',        hint: 'Avatar / foto profissional', tone: 'light' }
];

function placeholder({ w, h, label, hint, tone }) {
  const bgA = tone === 'dark' ? '#03252A' : '#D6EBED';
  const bgB = tone === 'dark' ? '#01717B' : '#FFFFFF';
  const fg  = tone === 'dark' ? '#FFFFFF' : '#014951';
  const sub = tone === 'dark' ? '#9CD8DC' : '#01717B';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="${bgA}"/>
      <stop offset="100%" stop-color="${bgB}"/>
    </linearGradient>
    <pattern id="d" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.2" fill="${sub}" opacity=".35"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#d)"/>
  <g transform="translate(${w/2}, ${h/2 - 70})">
    <circle r="64" fill="${fg}" opacity=".08"/>
    <path d="M -34 -22 h 68 a 8 8 0 0 1 8 8 v 36 a 8 8 0 0 1 -8 8 h -68 a 8 8 0 0 1 -8 -8 v -36 a 8 8 0 0 1 8 -8 z" fill="none" stroke="${fg}" stroke-width="3" opacity=".7"/>
    <circle cx="0" cy="2" r="14" fill="none" stroke="${fg}" stroke-width="3" opacity=".7"/>
    <circle cx="24" cy="-12" r="2.5" fill="${fg}" opacity=".7"/>
  </g>
  <text x="50%" y="${h/2 + 40}"  text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="${Math.max(34, Math.min(w,h)/14)}" font-weight="800" fill="${fg}" letter-spacing="-0.5">${label}</text>
  <text x="50%" y="${h/2 + 86}"  text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${Math.max(18, Math.min(w,h)/30)}" fill="${sub}">${hint}</text>
  <text x="50%" y="${h/2 + 122}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${Math.max(14, Math.min(w,h)/40)}" fill="${sub}" opacity=".8">substitua public/img/${(label||'').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-')}.jpg  -  ${w}x${h}px</text>
  <rect x="24" y="24" width="${w-48}" height="${h-48}" fill="none" stroke="${fg}" stroke-width="2" stroke-dasharray="6 8" opacity=".35" rx="18"/>
</svg>`;
}

for (const slot of SLOTS) {
  /* gera .svg com o nome do .jpg pretendido para servir de fallback */
  const svgName = slot.file.replace(/\.(jpg|png|jpeg|webp)$/i, '.svg');
  writeFileSync(join(OUT_DIR, svgName), placeholder(slot), 'utf8');
  console.log('OK ' + svgName);
}

/* Logo branca svg simples (placeholder) */
const logo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" width="240" height="64">
  <rect x="0" y="6" width="52" height="52" rx="12" fill="#01717B"/>
  <path d="M14 18h6v12h12V18h6v28h-6V36H20v10h-6V18z" fill="#fff"/>
  <text x="62" y="32" font-family="Manrope, sans-serif" font-size="22" font-weight="800" fill="#014951" letter-spacing="-0.3">HSFA</text>
  <text x="62" y="50" font-family="Inter, sans-serif" font-size="11" fill="#5C6E72">Guia do Paciente</text>
</svg>`;
writeFileSync(join(OUT_DIR, 'logo.svg'), logo, 'utf8');
console.log('OK logo.svg');

/* Selo ONA simples */
const selo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="rg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2A9D9E"/>
      <stop offset="100%" stop-color="#014951"/>
    </radialGradient>
  </defs>
  <circle cx="200" cy="200" r="190" fill="url(#rg)"/>
  <circle cx="200" cy="200" r="170" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>
  <text x="200" y="160" text-anchor="middle" font-family="Manrope, sans-serif" font-size="34" font-weight="800" fill="#fff">ACREDITADO</text>
  <text x="200" y="220" text-anchor="middle" font-family="Manrope, sans-serif" font-size="78" font-weight="800" fill="#fff" letter-spacing="6">ONA</text>
  <text x="200" y="260" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" fill="#D6EBED">Nivel 3 - Excelencia</text>
  <text x="200" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" fill="#D6EBED" opacity=".7">substitua public/img/selo-ona.png</text>
</svg>`;
writeFileSync(join(OUT_DIR, 'selo-ona.svg'), selo, 'utf8');
console.log('OK selo-ona.svg');

/* favicon e icones PWA */
const icon = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size*0.18}" fill="#01717B"/>
  <path d="M${size*0.25} ${size*0.22}h${size*0.12}v${size*0.22}h${size*0.26}V${size*0.22}h${size*0.12}v${size*0.56}h${-size*0.12}v${-size*0.18}h${-size*0.26}v${size*0.18}h${-size*0.12}V${size*0.22}z" fill="#fff"/>
</svg>`;
writeFileSync(join(OUT_DIR, 'icon.svg'),               icon(64),  'utf8');
writeFileSync(join(OUT_DIR, 'icon-192.svg'),           icon(192), 'utf8');
writeFileSync(join(OUT_DIR, 'icon-512.svg'),           icon(512), 'utf8');
writeFileSync(join(OUT_DIR, 'apple-touch-icon.svg'),   icon(180), 'utf8');
writeFileSync(join(OUT_DIR, 'favicon-32.svg'),         icon(32),  'utf8');
console.log('OK icons');

console.log('\nTotal de placeholders gerados em ' + OUT_DIR);
