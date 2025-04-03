# crud-master/scripts/setup_gateway.sh

#!/bin/bash

# Mise à jour du système
sudo apt-get update -y
sudo apt-get update --fix-missing
sudo apt-get upgrade -y
sudo apt install net-tools

# Installation des dépendances communes
sudo apt-get install -y \
  curl \
  git \
  gnupg2 \
  ca-certificates \
  lsb-release \
  software-properties-common

# Installation de Node.js 16.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g npm@11.2.0

# Installation de PM2
sudo npm install -g pm2

# Configuration du firewall
sudo ufw disable

# Installation des dépendances
sudo apt-get update
sudo apt-get install -y nginx

# Configuration du reverse proxy
sudo tee /etc/nginx/sites-available/api_gateway <<EOF
server {
    listen 80;
    server_name localhost;

    # Proxy pour l'API de films
    location /api/movies {
        proxy_pass http://192.168.56.20:8080;  # IP et port de l'API Inventory
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Proxy pour l'API de facturation
    location /api/billing {
        proxy_pass http://192.168.56.30:7070;  # IP et port de l'API Billing
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Activer le site Nginx et redémarrer
sudo ln -sf /etc/nginx/sites-available/api_gateway /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Installation des dépendances Node.js
cd /vagrant/srcs/api-gateway
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv
