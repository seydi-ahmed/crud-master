#!/bin/bash

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
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_user guest diouf
sudo rabbitmqctl set_user_tags guest administrator
sudo rabbitmqctl set_permissions -p / guest ".*" ".*" ".*"

# Installation des dépendances Node.js
cd /vagrant/srcs/billing-app
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore amqplib dotenv