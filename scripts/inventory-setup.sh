# crud-master/scripts/inventory-setup.sh

#!/bin/bash

# Update packages
apt-get update -y

# Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
sudo apt-get install -y nodejs
sudo apt install net-tools
npm install -g pm2  # Installer PM2 globalement

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Configure PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE movies;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'diouf';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE movies TO postgres;"

# Installer RabbitMQ
apt-get install -y rabbitmq-server

# Vérifier si RabbitMQ est actif, sinon le démarrer
systemctl is-active --quiet rabbitmq-server || systemctl start rabbitmq-server

# Activer RabbitMQ au démarrage de la VM
systemctl enable rabbitmq-server

# Autoriser PostgreSQL à accepter les connexions depuis n'importe quelle IP
echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/12/main/pg_hba.conf

# Redémarrer PostgreSQL pour appliquer les changements
systemctl restart postgresql

# Install Inventory API
cd /vagrant/srcs/inventory-app
npm install
npm install -g pm2

# Start the Inventory API with PM2
pm2 start server.js --name "inventory-app"

# Configurer PM2 pour démarrer au boot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

# Save PM2 processes
pm2 save
pm2 startup
