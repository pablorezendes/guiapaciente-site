#!/bin/bash
# ============================================================
# Setup automatico no servidor - Guia do Paciente HSFA
# Roda como root em /home/guiapaciente apos clonar o repo.
# ============================================================

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

PROJECT_DIR="/home/guiapaciente"
DOMAIN="guiapaciente.hsfasaude.com.br"
# CloudPanel inclui apenas *.conf - manter a extensao!
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_LINK="/etc/nginx/sites-enabled/${DOMAIN}.conf"

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Setup Guia do Paciente HSFA${NC}"
echo -e "${BLUE}=============================================${NC}"

cd "$PROJECT_DIR"

# ---------- 1. Conferir .env ----------
if [ ! -f .env ]; then
    echo -e "${YELLOW}.env nao encontrado - criando exemplo...${NC}"
    cat > .env <<EOF
GITHUB_TOKEN=ghp_TROCAR_AQUI
GITHUB_REPO=pablorezendes/guiapaciente-site
DEPLOY_BRANCH=main
PORT=3010
HOST=0.0.0.0
NODE_ENV=production
ADMIN_PASSWORD=$(head -c 12 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 12)
ADMIN_SESSION_HOURS=24
EOF
    chmod 600 .env
    echo -e "${RED}Edite /home/guiapaciente/.env e coloque o GITHUB_TOKEN, depois rode novamente.${NC}"
    exit 1
fi

# ---------- 2. Node e PM2 ----------
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Instalando Node.js 20 LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}Node: $(node -v)${NC}"

if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Instalando PM2...${NC}"
    npm install -g pm2
fi

# ---------- 3. Deploy (npm i + build + pm2) ----------
chmod +x deploy.sh
./deploy.sh --skip-pull

# ---------- 4. Nginx ----------
if [ ! -d /etc/nginx ]; then
    echo -e "${YELLOW}Instalando Nginx...${NC}"
    apt-get update && apt-get install -y nginx
fi

cp server/nginx-guiapaciente.conf "$NGINX_SITE"
ln -sf "$NGINX_SITE" "$NGINX_LINK"

mkdir -p /var/www/html

nginx -t && systemctl reload nginx
echo -e "${GREEN}Nginx configurado para $DOMAIN${NC}"

# ---------- 5. SSL via Certbot ----------
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Instalando Certbot...${NC}"
    apt-get install -y certbot python3-certbot-nginx
fi

echo -e "${BLUE}Gerando certificado SSL para $DOMAIN...${NC}"
echo -e "${YELLOW}Certifique-se de que o DNS de $DOMAIN ja aponta para este servidor.${NC}"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m pablorezendes@gmail.com --redirect || \
    echo -e "${YELLOW}Certbot falhou - rode manualmente: certbot --nginx -d $DOMAIN${NC}"

# ---------- 6. PM2 startup ----------
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

echo ""
echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}  Setup concluido!${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "Acesse: ${BLUE}https://$DOMAIN${NC}"
echo ""
pm2 status
