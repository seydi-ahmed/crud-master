# crud-master/scripts/gateway-setup.sh

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
npm install -g pm2

# Start the API Gateway with PM2
pm2 start server.js --name api-gateway

# Configurer PM2 pour démarrer au boot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

# Save PM2 processes
pm2 save
pm2 startup
