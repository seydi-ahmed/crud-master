#!/bin/bash

# Création de l'arborescence du projet
mkdir -p \
  scripts/ \
  srcs/api-gateway \
  srcs/billing-app/app/{config,controllers,models} \
  srcs/inventory-app/app/{config,controllers,models,routes}

# Fichiers principaux
touch \
  README.md \
  .env \
  Vagrantfile \
  config.yaml

# Fichiers pour API Gateway
touch \
  srcs/api-gateway/package.json \
  srcs/api-gateway/proxy.js \
  srcs/api-gateway/routes.js \
  srcs/api-gateway/server.js

# Fichiers pour Billing App
touch \
  srcs/billing-app/package.json \
  srcs/billing-app/server.js \
  srcs/billing-app/app/config/database.js \
  srcs/billing-app/app/config/rabbitmq.js \
  srcs/billing-app/app/controllers/billing.controller.js \
  srcs/billing-app/app/models/order.model.js

# Fichiers pour Inventory App
touch \
  srcs/inventory-app/package.json \
  srcs/inventory-app/server.js \
  srcs/inventory-app/app/config/database.js \
  srcs/inventory-app/app/controllers/movie.controller.js \
  srcs/inventory-app/app/models/movie.model.js \
  srcs/inventory-app/app/routes/movie.routes.js

# Fichier .gitignore
cat > .gitignore <<EOL
node_modules/
.env
.vagrant/
*.log
.DS_Store
EOL

# Rendre le script exécutable
chmod +x scripts/setup_project.sh

echo "Structure de projet créée avec succès."