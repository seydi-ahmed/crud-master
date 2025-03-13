#!/bin/bash

# Update packages
apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs

# Install API Gateway
cd /vagrant/srcs/api-gateway
npm install

# Start the API Gateway
npm start