#!/bin/bash

# Update packages
apt-get update

# Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs
npm install -g pm2  # Installer PM2 globalement

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Configure PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE movies;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'diouf';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE movies TO postgres;"

# Install Inventory API
cd /vagrant/srcs/inventory-app
npm install

# Start the Inventory API with PM2
pm2 start server.js --name inventory-app

# Save PM2 processes
pm2 save
pm2 startup
