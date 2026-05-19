#!/bin/bash
# ============================================================
# Corrige o setup do nginx no CloudPanel
# - Move config para *.conf (CloudPanel ignora arquivos sem .conf)
# - Restaura default.conf do backup do certbot
# - Habilita as linhas SSL na nossa config
# - Testa + reload nginx
# ============================================================

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

DOMAIN="guiapaciente.hsfasaude.com.br"
OLD_LINK="/etc/nginx/sites-enabled/${DOMAIN}"
OLD_SRC="/etc/nginx/sites-available/${DOMAIN}"
NEW_SRC="/etc/nginx/sites-available/${DOMAIN}.conf"
NEW_LINK="/etc/nginx/sites-enabled/${DOMAIN}.conf"
DEFAULT_CONF="/etc/nginx/sites-enabled/default.conf"
PROJECT_DIR="/home/guiapaciente"

echo -e "${BLUE}=== Corrigindo setup nginx para $DOMAIN ===${NC}"
echo ""

# ---------- 1. Remover symlink antigo sem .conf ----------
echo -e "${BLUE}[1/6] Removendo symlink antigo (sem .conf)...${NC}"
[ -L "$OLD_LINK" ] && rm -f "$OLD_LINK" && echo "  - removido $OLD_LINK"
[ -f "$OLD_SRC" ]  && rm -f "$OLD_SRC"  && echo "  - removido $OLD_SRC"

# ---------- 2. Restaurar default.conf do backup do certbot ----------
echo -e "${BLUE}[2/6] Procurando backup do default.conf...${NC}"
BACKUP=""
for d in $(ls -td /var/lib/letsencrypt/backups/*/ 2>/dev/null); do
    if [ -f "${d}sites-enabled/default.conf" ]; then
        BACKUP="${d}sites-enabled/default.conf"
        break
    fi
done
# Fallback: procurar em outros locais
[ -z "$BACKUP" ] && BACKUP=$(find /var/lib/letsencrypt /var/log/letsencrypt /etc/letsencrypt -name "default.conf*" -type f 2>/dev/null | head -1)

if [ -n "$BACKUP" ] && [ -f "$BACKUP" ]; then
    cp "$DEFAULT_CONF" "${DEFAULT_CONF}.before-fix.bak"
    cp "$BACKUP" "$DEFAULT_CONF"
    echo -e "${GREEN}  - default.conf restaurado de $BACKUP${NC}"
    echo -e "${YELLOW}  - antigo salvo em ${DEFAULT_CONF}.before-fix.bak${NC}"
else
    echo -e "${YELLOW}  - sem backup do certbot encontrado.${NC}"
    echo -e "${YELLOW}  - Vou tentar remover o server block que o certbot adicionou.${NC}"

    cp "$DEFAULT_CONF" "${DEFAULT_CONF}.before-fix.bak"

    # Remove blocos cujo server_name contenha o dominio
    awk -v dom="$DOMAIN" '
        BEGIN { skip=0; depth=0; buf="" }
        /^[[:space:]]*server[[:space:]]*\{/ { in_block=1; depth=1; buf=$0"\n"; next }
        in_block {
            buf = buf $0 "\n"
            n=gsub(/\{/, "{"); depth += n
            n=gsub(/\}/, "}"); depth -= n
            if (buf ~ ("server_name[[:space:]]+[^;]*" dom)) skip=1
            if (depth == 0) {
                if (!skip) printf "%s", buf
                in_block=0; skip=0; buf=""
            }
            next
        }
        { print }
    ' "${DEFAULT_CONF}.before-fix.bak" > "$DEFAULT_CONF"
    echo -e "${GREEN}  - removido server block de $DOMAIN do default.conf${NC}"
fi

# ---------- 3. Copiar nossa config com extensao .conf ----------
echo -e "${BLUE}[3/6] Copiando nginx-guiapaciente.conf...${NC}"
cp "$PROJECT_DIR/server/nginx-guiapaciente.conf" "$NEW_SRC"
ln -sf "$NEW_SRC" "$NEW_LINK"
echo -e "${GREEN}  - $NEW_LINK -> $NEW_SRC${NC}"

# ---------- 4. Habilitar SSL na nossa config ----------
echo -e "${BLUE}[4/6] Habilitando SSL...${NC}"
sed -i \
    -e 's|# ssl_certificate     |ssl_certificate     |' \
    -e 's|# ssl_certificate_key |ssl_certificate_key |' \
    -e 's|# include             /etc/letsencrypt/options-ssl-nginx|include             /etc/letsencrypt/options-ssl-nginx|' \
    -e 's|# ssl_dhparam         |ssl_dhparam         |' \
    "$NEW_SRC"

# Garantir que dhparams existe (Certbot 2.x deixou de criar por padrao)
if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
    echo -e "${YELLOW}  - gerando dhparams (2048 bits)... pode demorar 1-2 min${NC}"
    openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048 2>/dev/null
fi

# Garantir options-ssl-nginx.conf (idem)
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
    cat > /etc/letsencrypt/options-ssl-nginx.conf <<'EOF'
ssl_session_cache shared:le_nginx_SSL:10m;
ssl_session_timeout 1440m;
ssl_session_tickets off;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
EOF
fi

echo -e "${GREEN}  - SSL habilitado${NC}"

# ---------- 5. Testar nginx ----------
echo -e "${BLUE}[5/6] Testando nginx...${NC}"
if nginx -t 2>&1 | tee /tmp/nginx-test.log; then
    echo -e "${GREEN}  - nginx -t OK${NC}"
else
    echo -e "${RED}  - nginx -t FALHOU. Veja /tmp/nginx-test.log${NC}"
    echo -e "${YELLOW}  - default.conf backup esta em ${DEFAULT_CONF}.before-fix.bak${NC}"
    exit 1
fi

# ---------- 6. Reload ----------
echo -e "${BLUE}[6/6] Reload nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}  - nginx recarregado${NC}"

echo ""
echo -e "${GREEN}=== Corrigido! ===${NC}"
echo -e "Teste: ${BLUE}curl -I https://$DOMAIN${NC}"
echo -e "Abra:  ${BLUE}https://$DOMAIN${NC}"
