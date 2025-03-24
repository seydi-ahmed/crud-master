# crud-master/scripts/billing-setup.sh

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
sudo -u postgres psql -c "CREATE DATABASE orders;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'diouf';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE orders TO postgres;"

# Install RabbitMQ
apt-get install -y rabbitmq-server
systemctl enable rabbitmq-server
systemctl start rabbitmq-server

# Install Billing API
cd /vagrant/srcs/billing-app
npm install
npm install -g pm2

# Start the Billing API with PM2
pm2 start server.js --name billing-app

# Save PM2 processes
pm2 save
pm2 startup
