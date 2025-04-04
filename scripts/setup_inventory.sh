# crud-master/scripts/setup_inventory.sh

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

# PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${POSTGRES_PASSWORD}';"
sudo -u postgres createdb ${POSTGRES_DB_MOVIES}

# Table Movies
sudo -u postgres psql -d ${POSTGRES_DB_MOVIES} -c "
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);"

# Node app deps
cd /vagrant/srcs/inventory-app
npm install
npm install -g npm@latest || true
npm install express sequelize pg pg-hstore dotenv