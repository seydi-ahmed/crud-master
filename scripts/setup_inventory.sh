#!/bin/bash

# Installation de PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Configuration de PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'diouf';"
sudo -u postgres createdb movies

# Création de la table movies
sudo -u postgres psql -d movies -c "
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);"

# Installation des dépendances Node.js
cd /vagrant/srcs/inventory-app
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv