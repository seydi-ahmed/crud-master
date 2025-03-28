# crud-master/scripts/setup_inventory.sh

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
sudo -u postgres createdb movies

# Création de la table movies
sudo -u postgres psql -d movies -c "
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);"
sudo systemctl restart rabbitmq-server

# Installation des dépendances Node.js
cd /vagrant/srcs/inventory-app
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv

# # Démarrer avec PM2 et forcer le restart si déjà lancé
# pm2 delete "inventory-app" || true
# pm2 start server.js --name "inventory-app" --watch
# pm2 save
