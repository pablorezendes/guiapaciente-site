#!/bin/bash

# ===================================================
# Script de Deploy Automatizado - Guia do Paciente HSFA
# ===================================================
# Espelhado do deploy.sh do hsfasaude.com.br
# Uso: ./deploy.sh [--skip-build] [--skip-pm2] [--skip-pull]
#
# Requisitos no .env:
#   GITHUB_TOKEN=ghp_xxxxx
#   GITHUB_REPO=pablorezendes/guiapaciente-site
#   DEPLOY_BRANCH=main   (opcional, default: main)

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Diretorio do projeto (ajuste conforme servidor)
PROJECT_DIR="${PROJECT_DIR:-/home/hsfasaude/htdocs/guiapaciente.hsfasaude.com.br}"

# Nome da app PM2
APP_NAME="guiapaciente-site"

# Flags
SKIP_BUILD=false
SKIP_PM2=false
SKIP_PULL=false

for arg in "$@"; do
    case $arg in
        --skip-build) SKIP_BUILD=true; shift ;;
        --skip-pm2)   SKIP_PM2=true; shift ;;
        --skip-pull)  SKIP_PULL=true; shift ;;
        *) ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deploy Guia do Paciente HSFA${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

cd "$PROJECT_DIR"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Erro: Node.js nao esta instalado.${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js: $(node -v)${NC}"

# Carregar .env
if [ ! -f ".env" ]; then
    echo -e "${RED}Erro: .env nao encontrado em $PROJECT_DIR${NC}"
    exit 1
fi

while IFS='=' read -r key value || [ -n "$key" ]; do
    if [[ -n "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
        key=$(echo "$key" | xargs)
        if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"
            export "$key=$value"
        fi
    fi
done < .env
echo -e "${GREEN}.env carregado${NC}"

DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

# ========================================
# ETAPA 1: Puxar codigo do GitHub
# ========================================
if [ "$SKIP_PULL" = false ]; then
    echo ""
    echo -e "${BLUE}[1/4] Puxando codigo do GitHub...${NC}"

    if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_REPO" ]; then
        echo -e "${RED}Erro: GITHUB_TOKEN e GITHUB_REPO devem estar definidos no .env${NC}"
        echo -e "${YELLOW}Exemplo:${NC}"
        echo "  GITHUB_TOKEN=ghp_xxxxxxxxxxxx"
        echo "  GITHUB_REPO=pablorezendes/guiapaciente-site"
        exit 1
    fi

    REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git"

    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}Inicializando repositorio git...${NC}"
        git init
        git remote add origin "$REPO_URL"
    else
        git remote set-url origin "$REPO_URL"
    fi

    echo -e "${YELLOW}Buscando atualizacoes do branch ${DEPLOY_BRANCH}...${NC}"
    git fetch origin "$DEPLOY_BRANCH"
    git reset --hard "origin/${DEPLOY_BRANCH}"
    git clean -fd --exclude=.env --exclude=node_modules --exclude=logs

    echo -e "${GREEN}Codigo atualizado para o ultimo commit do ${DEPLOY_BRANCH}${NC}"
else
    echo -e "${YELLOW}[1/4] Pull do GitHub pulado (--skip-pull)${NC}"
fi

# ========================================
# ETAPA 2: Instalar dependencias
# ========================================
echo ""
echo -e "${BLUE}[2/4] Instalando dependencias...${NC}"

npm install --omit=dev 2>&1 | tail -5
echo -e "${GREEN}Dependencias de producao instaladas${NC}"

# ========================================
# ETAPA 3: Build
# ========================================
if [ "$SKIP_BUILD" = false ]; then
    echo ""
    echo -e "${BLUE}[3/4] Buildando frontend (Vite)...${NC}"

    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        echo -e "${GREEN}Pasta dist ja existe no repositorio (build via CI?)${NC}"
    else
        echo -e "${YELLOW}Instalando devDependencies para o build...${NC}"
        npm install --include=dev 2>&1 | tail -5
        npx vite build || npm run build
    fi

    mkdir -p logs
    chmod 755 logs 2>/dev/null || true

    echo -e "${GREEN}Build pronto em dist/${NC}"
else
    echo -e "${YELLOW}[3/4] Build pulado (--skip-build)${NC}"
fi

# ========================================
# ETAPA 4: PM2
# ========================================
if [ "$SKIP_PM2" = false ]; then
    echo ""
    echo -e "${BLUE}[4/4] Reiniciando aplicacao no PM2...${NC}"

    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}Instalando PM2...${NC}"
        npm install -g pm2
    fi

    if [ ! -f "server.js" ]; then
        echo -e "${RED}Erro: server.js nao encontrado${NC}"
        exit 1
    fi

    ECOSYSTEM_FILE=""
    if [ -f "ecosystem.config.cjs" ]; then
        ECOSYSTEM_FILE="ecosystem.config.cjs"
    elif [ -f "ecosystem.config.js" ]; then
        ECOSYSTEM_FILE="ecosystem.config.js"
    fi

    if pm2 list | grep -q "$APP_NAME"; then
        pm2 restart "$APP_NAME" --update-env
    else
        if [ -n "$ECOSYSTEM_FILE" ]; then
            pm2 start "$ECOSYSTEM_FILE" || pm2 start server.js --name "$APP_NAME"
        else
            pm2 start server.js --name "$APP_NAME" --max-memory-restart 400M
        fi
    fi

    pm2 save

    sleep 2
    if pm2 list | grep -q "$APP_NAME.*online"; then
        echo -e "${GREEN}Aplicacao rodando no PM2${NC}"
    else
        echo -e "${RED}Erro: Aplicacao nao esta online${NC}"
        echo -e "${YELLOW}Verifique: pm2 logs $APP_NAME${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}[4/4] PM2 pulado (--skip-pm2)${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Deploy concluido com sucesso!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$SKIP_PM2" = false ]; then
    pm2 status
    echo ""
fi

echo -e "${BLUE}Acesse: https://guiapaciente.hsfasaude.com.br${NC}"
echo ""
