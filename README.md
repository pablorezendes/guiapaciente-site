# Guia do Paciente HSFA — v2.0

Site institucional do **Guia do Paciente** do Hospital São Francisco de Assis (HSFA), construído na **mesma estrutura do site principal `hsfasaude.com.br`** (Node.js + Vite + Express + PM2) e com design futurista.

> Domínio sugerido: `guiapaciente.hsfasaude.com.br`
> App PM2: `guiapaciente-site`

---

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| Build  | **Vite 5** (output em `dist/`) |
| Server | **Express 4** servindo `dist/` + `/api/ouvidoria` |
| Proc.  | **PM2** (`ecosystem.config.cjs`) |
| Deploy | `deploy.sh` (espelhado do hsfasaude) |
| PWA    | manifest + service worker offline |
| i18n   | PT / EN / ES |

---

## Estrutura

```
guiapaciente/
├── package.json
├── server.js                # Express (producao)
├── ecosystem.config.cjs     # PM2
├── vite.config.js
├── deploy.sh                # Igualzinho ao do hsfasaude
├── .env.example
├── .gitignore
├── index.html               # Entry Vite
├── src/
│   ├── main.js              # importa CSS + scripts
│   ├── styles/
│   │   ├── main.css         # camada futurista
│   │   └── legacy.css       # base completa do design
│   └── scripts/
│       ├── i18n.js          # PT/EN/ES
│       ├── faq-data.js      # base do chatbot
│       ├── legacy.js        # logica original (i18n, tabs, FAQ, form, chat, PWA)
│       └── reveal.js        # scroll reveal + counters
├── public/
│   ├── manifest.json        # PWA
│   ├── sw.js                # service worker
│   └── img/                 # << SLOTS DE IMAGEM (troque os arquivos) >>
├── scripts/
│   └── generate-placeholders.mjs  # regera os placeholders quando precisar
└── dist/                    # gerado pelo `npm run build`
```

---

## Como rodar local

```bash
npm install
npm run dev          # http://localhost:5173 (Vite)
```

## Build de produção

```bash
npm run build        # gera dist/
npm run start        # node server.js -> http://localhost:3010
```

## Deploy no servidor (mesmo padrão do hsfasaude)

1. Crie o `.env` baseado em `.env.example`
2. Suba o repositório no GitHub
3. No servidor:

```bash
./deploy.sh                  # pull + npm i + build + pm2 restart
./deploy.sh --skip-build     # pula o build (usa dist/ do repo)
./deploy.sh --skip-pull      # pula o git pull
./deploy.sh --skip-pm2       # pula o PM2
```

O `PROJECT_DIR` é auto-detectado da pasta do `deploy.sh` (pode sobrescrever via env var). No servidor HSFA, o projeto vive em `/home/guiapaciente/`.

---

## 🖼️ Onde colocar cada imagem

Todas as imagens vivem em **`public/img/`**. Hoje cada slot tem um **SVG placeholder autoexplicativo** (mostra o nome e a dimensão recomendada). Para colocar a sua imagem real, **apenas substitua o arquivo mantendo o mesmo nome** (`.svg`). Se quiser usar `.jpg`/`.png`, troque também o `src=` no `index.html` (já está marcado por comentários `<!-- SLOT: ... -->`).

### Mapa visual dos slots

| Slot | Arquivo | Dimensão | Onde aparece |
| ---- | ------- | -------- | ------------ |
| **Logo** | `public/img/logo.svg` | 240×64 | Header (canto sup. esq.) |
| **Selo ONA** | `public/img/selo-ona.svg` | 400×400 | Flutua sobre a capa do hero |
| **Capa do hero** | `public/img/hero-capa.svg` | 900×1200 (3:4) | Card 3D do hero |
| **Recepção** | `public/img/recepcao.svg` | 1400×900 | Aba *Enfermaria* (acomodações) |
| **Enfermaria** | `public/img/enfermaria.svg` | 1400×900 | Aba *Enfermaria* |
| **Apartamento** | `public/img/apartamento.svg` | 1400×900 | Aba *Apartamento* |
| **Refeitório** | `public/img/refeitorio.svg` | 1400×900 | Aba *Apartamento* |
| **UTI** | `public/img/uti.svg` | 1400×900 | Aba *UTI* |
| **Centro Cirúrgico** | `public/img/centro-cirurgico.svg` | 1400×900 | Aba *UTI* |
| **UTI Humanizada** | `public/img/uti-humanizada.svg` | 1400×900 | Aba *UTI Humanizada* |
| **Plantão 24h** | `public/img/plantao24h.svg` | 1400×900 | Aba *UTI Humanizada* |
| **Foto do time** | `public/img/equipe-foto.svg` | 1400×900 | Topo da seção *Equipe* |
| **Avatar enfermagem** | `public/img/equipe-enfermagem.svg` | 800×800 | Card *Enfermagem* |
| **Avatar fisioterapia** | `public/img/equipe-fisioterapia.svg` | 800×800 | Card *Fisioterapia* |
| **Avatar terapia ocup.** | `public/img/equipe-to.svg` | 800×800 | Card *Terapia Ocupacional* |
| **Avatar odontologia** | `public/img/equipe-odonto.svg` | 800×800 | Card *Odontologia* |
| **Avatar serviço social** | `public/img/equipe-servicosocial.svg` | 800×800 | Card *Serviço Social* |
| **Avatar farmácia** | `public/img/equipe-farmacia.svg` | 800×800 | Card *Farmácia Clínica* |
| **Ícones PWA** | `icon.svg`, `icon-192.svg`, `icon-512.svg`, `apple-touch-icon.svg`, `favicon-32.svg` | — | Manifest + tab do browser |

### Forma recomendada: Painel Admin

Acesse **`https://guiapaciente.hsfasaude.com.br/admin`**, faça login com a senha do `.env` (`ADMIN_PASSWORD`) e envie as imagens pelo navegador. A troca é **instantânea** — não precisa rebuildar nem reiniciar o PM2.

- Grid com os 19 slots, preview ao vivo, filtro por categoria
- Aceita `JPG`, `PNG`, `WEBP` até 10 MB
- Botão "↺" volta a imagem ao placeholder padrão
- As imagens enviadas ficam em `data/uploads/` (fora do git, sobrevivem a deploys)
- O servidor intercepta `/img/<slot>.*` e serve o upload por cima do default — o HTML não muda

### Forma manual (via código)

1. Pegue sua foto já no tamanho do quadro.
2. Renomeie para o nome do slot. Ex.: `uti-humanizada.jpg`.
3. Coloque em `public/img/` substituindo o SVG.
4. No `index.html`, troque a extensão no `src` (procure `<!-- SLOT: ... -->`).
5. `npm run build` para regenerar o `dist/`.

Para regerar todos os placeholders do zero:

```bash
node scripts/generate-placeholders.mjs
```

---

## Painel Admin

| Item | Detalhe |
| ---- | ------- |
| URL | `/admin` |
| Senha | `.env` → `ADMIN_PASSWORD` |
| Sessão | cookie httpOnly, expira em `ADMIN_SESSION_HOURS` (default 24h) |
| Upload | `data/uploads/<slot>.<ext>` |
| Endpoints | `POST /api/admin/login`, `/logout`, `GET /api/admin/slots`, `POST /api/admin/upload/:slot`, `DELETE /api/admin/upload/:slot` |

A senha é gerada aleatoriamente pelo `server/install.sh` na primeira execução — veja em `/home/guiapaciente/.env`. Para trocar, edite o `.env` e rode `./deploy.sh --skip-pull --skip-build`.

---

## Configurações pós-deploy

### Webhook da ouvidoria

O `server.js` já expõe `POST /api/ouvidoria` (loga no console). Para encaminhar para e-mail/SendGrid/etc., abra `server.js` e implemente o forward dentro do handler.

### Domínio do PWA

O `manifest.json` está configurado com `start_url: /` — funciona em subdomínio dedicado (`guiapaciente.hsfasaude.com.br`). Para subpath, ajuste `start_url` + `scope`.

---

## Idioma padrão / textos

- **PT/EN/ES**: edite `src/scripts/i18n.js`
- **FAQ + chatbot**: edite `src/scripts/faq-data.js`

---

## Endereços úteis

- Central HSFA: **(62) 3221-8000**
- Site institucional: <https://www.hsfasaude.com.br>
- Endereço: R. 9-A, 110 — Setor Aeroporto, Goiânia-GO

**HSFA — Plantão 24h • Acreditado ONA • Qualificado UNIMED**
