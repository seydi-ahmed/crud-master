# crud-master/scripts/setup_billing.sh

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

# Installation de PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Configuration de PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'diouf';"
sudo -u postgres createdb orders

# Création de la table orders
sudo -u postgres psql -d orders -c "
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    number_of_items INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# Installation de RabbitMQ
sudo apt-get install -y rabbitmq-server
sudo tee /etc/rabbitmq/rabbitmq-env.conf <<EOF
NODE_IP_ADDRESS=0.0.0.0
NODE_PORT=5672
EOF
sudo tee /etc/rabbitmq/rabbitmq.conf <<EOF
loopback_users = none
listeners.tcp.default = 5672
default_pass = diouf
default_user = guest
EOF
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_user guest diouf
sudo rabbitmqctl change_password guest diouf
sudo rabbitmqctl set_user_tags guest administrator
sudo rabbitmqctl set_permissions -p / guest ".*" ".*" ".*"
sudo systemctl restart rabbitmq-server

sudo rabbitmqctl add_user gateway diouf
sudo rabbitmqctl set_user_tags gateway administrator
sudo rabbitmqctl set_permissions -p / gateway ".*" ".*" ".*"
sudo systemctl restart rabbitmq-server

# Installation des dépendances Node.js
cd /vagrant/srcs/billing-app
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv

# # Démarrer avec PM2 et forcer le restart si déjà lancé
# pm2 delete "billing-app" || true
# pm2 start server.js --name "billing-app" --watch
# pm2 save