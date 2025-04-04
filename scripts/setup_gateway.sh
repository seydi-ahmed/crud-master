# crud-master/scripts/setup_gateway.sh

#!/bin/bash

# Charger les variables d'environnement
source /vagrant/.env

# Mise à jour système
sudo apt-get update -y
sudo apt-get update --fix-missing
sudo apt-get upgrade -y
sudo apt install -y net-tools

# Dépendances communes
sudo apt-get install -y curl git gnupg2 ca-certificates lsb-release software-properties-common

# Node.js + PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g npm@11.2.0 pm2

# Firewall
sudo ufw disable

# Nginx pour reverse proxy
sudo apt-get install -y nginx

# Config nginx dynamique
sudo tee /etc/nginx/sites-available/api_gateway <<EOF
server {
    listen 80;
    server_name localhost;

    location /api/movies {
        proxy_pass ${INVENTORY_API_URL}:${INVENTORY_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api/billing {
        proxy_pass http://${RABBITMQ_HOST}:${BILLING_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/api_gateway /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Dépendances Node.js
cd /vagrant/srcs/api-gateway
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv