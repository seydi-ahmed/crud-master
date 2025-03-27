#!/bin/bash

# Configuration spécifique à l'API Gateway

# Installation des dépendances
sudo apt-get install -y nginx

# Configuration du reverse proxy
sudo tee /etc/nginx/sites-available/api_gateway <<EOF
server {
    listen ${GATEWAY_PORT};
    server_name localhost;

    location /api/movies {
        proxy_pass http://${INVENTORY_API_URL};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api/billing {
        proxy_pass http://localhost:${BILLING_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/api_gateway /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Installation des dépendances Node.js
cd /vagrant/srcs/api-gateway
npm install
npm install -g npm@latest || true
npm install express http-proxy-middleware amqplib dotenv
pm2 start server.js --name "api-gateway" --watch