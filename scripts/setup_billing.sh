# crud-master/scripts/setup_billing.sh

#!/bin/bash

# Charger les variables d'environnement
source /vagrant/.env

# Mise à jour du système
sudo apt-get update -y
sudo apt-get update --fix-missing
sudo apt-get upgrade -y
sudo apt install -y net-tools

# Installation des dépendances
sudo apt-get install -y curl git gnupg2 ca-certificates lsb-release software-properties-common

# Node.js + PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g npm@11.2.0 pm2

# Firewall
sudo ufw disable

# PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${POSTGRES_PASSWORD}';"
sudo -u postgres createdb ${POSTGRES_DB_ORDERS}

# Table Orders
sudo -u postgres psql -d ${POSTGRES_DB_ORDERS} -c "
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    number_of_items INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# RabbitMQ
sudo apt-get install -y rabbitmq-server

sudo tee /etc/rabbitmq/rabbitmq-env.conf <<EOF
NODE_IP_ADDRESS=0.0.0.0
NODE_PORT=${RABBITMQ_PORT}
EOF

sudo tee /etc/rabbitmq/rabbitmq.conf <<EOF
loopback_users = none
listeners.tcp.default = ${RABBITMQ_PORT}
EOF

sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_user ${RABBITMQ_USER} ${RABBITMQ_PASSWORD}
sudo rabbitmqctl set_user_tags ${RABBITMQ_USER} administrator
sudo rabbitmqctl set_permissions -p / ${RABBITMQ_USER} ".*" ".*" ".*"

sudo systemctl restart rabbitmq-server

# Node app deps
cd /vagrant/srcs/billing-app
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv