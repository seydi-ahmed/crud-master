#!/bin/bash

# Update packages
apt-get update

# Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs
npm install -g pm2  # Installer PM2 globalement

# Install API Gateway
cd /vagrant/srcs/api-gateway
npm install

# Start the API Gateway with PM2
pm2 start server.js --name api-gateway

# Save PM2 processes
pm2 save
pm2 startup
