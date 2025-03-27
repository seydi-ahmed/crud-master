#!/bin/bash

# Mise à jour du système
sudo apt-get update -y
sudo apt-get upgrade -y

# Installation des dépendances communes
sudo apt-get install -y \
  curl \
  git \
  gnupg2 \
  ca-certificates \
  lsb-release \
  software-properties-common

# Installation de Node.js 16.x
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install

# Installation de PM2
sudo npm install -g pm2

# Configuration du firewall
sudo ufw disable