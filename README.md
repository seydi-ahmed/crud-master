# CRUD-MASTER

## Installation des outils nécessaires

- ✅ VirtualBox
- ✅ Vagrant
- ✅ Node.js (avec Express, Sequelize et autres packages nécessaires)
- ✅ PostgreSQL
- ✅ RabbitMQ
- ✅ Postman
- ✅ PM2 (pour la gestion des processus Node.js)

## Structure du projet

```
.
├── README.md
├── config.yaml
├── .env
├── scripts
│   └── billing-setup.sh
│   ├── gateway-setup.sh
│   └── inventory-setup.sh
├── srcs
│   ├── api-gateway
│   │   ├── package.json
│   │   ├── proxy.js
│   │   ├── routes.js
│   │   └── server.js
│   ├── billing-app
│   │   ├── app
│   │   │   ├── config        // This is a directory with some .js files
│   │   │   ├── controllers   // This is a directory with some .js files
│   │   │   └── models        // This is a directory with some .js files
│   │   ├── package.json
│   │   └── server.js
│   └── inventory-app
│       ├── app
│       │   ├── config        // This is a directory with some .js files
│       │   ├── controllers   // This is a directory with some .js files
│       │   ├── models        // This is a directory with some .js files
│       │   └── routes        // This is a directory with some .js files
│       ├── package.json
│       └── server.js
└── Vagrantfile
```

## Role de chaque fichier/dossier:

1. .env

- contient les variable d'environnement nécessaires pour configurer les services (URL, identifiants des bases de données etc.)

2. Vagrantfile

- configure les 3 machines vituelles nécessaires pour le projet (gateway-vm, inventory-vm et billing-vm)

3. scripts/

- contient les scripts pour configurer chaque machine virtuelle
  - gateway-setup.sh : Installe Node.js, l'API Gateway, et ses dépendances.
  - inventory-setup.sh : Installe PostgreSQL, Node.js, et l'Inventory API.
  - billing-setup.sh : Installe RabbitMQ, PostgreSQL, Node.js, et la Billing API.

4. srcs/api-gateway/

- c'est le point d'entrée de toutes les requêtes. il route les requêtes vers l'inventory API(HTTP) ou le billing API(RabbitMQ)
- Fichiers:
  - package.json : Dépendances Node.js (Express, http-proxy-middleware, amqplib).
  - proxy.js : Configuration du proxy pour rediriger les requêtes.
  - routes.js : Définition des routes.
  - server.js : Point d'entrée de l'API Gateway.

5. srcs/inventory-app/

- gère les opérations CRUD sur les films. Elle utilise PostgreSQL pour stocker les données.
- Fichiers:
  - package.json : Dépendances Node.js (Express, Sequelize).
  - app/models/ : Modèles Sequelize pour la base de données.
  - app/controllers/ : Contrôleurs pour gérer les requêtes.
  - app/routes/ : Définition des routes.
  - server.js : Point d'entrée de l'API.

6. srcs/billing-app/

- traite les paiements via RabbitMQ. Elle stocke les commandes dans une base de données PostgreSQL.
- Fichiers:
  - package.json : Dépendances Node.js (Express, amqplib, Sequelize).
  - app/models/ : Modèles Sequelize pour la base de données.
  - app/controllers/ : Contrôleurs pour traiter les messages RabbitMQ.
  - server.js : Point d'entrée de l'API.

## Fonctionnement général du projet

1. Tests avec Postman

- Postman est utilisé pour tester les endpoints de l'API Gateway, de l'Inventory API et de la Billing API.
- Exemple de test :
  - POST /api/movies : Ajouter un film.
  - GET /api/movies : Récupérer tous les films.
  - POST /api/billing : Envoyer une commande de paiement.

2. Gestion des VMs avec Vagrant

- Commandes clés :
  - vagrant up : Démarre les VMs.
  - vagrant status : Affiche l'état des VMs.
  - vagrant ssh <vm-name> : Se connecte à une VM.

## Reste à faire

- cacher les credentials dans les fichiers scripts/\*, .env
- renforcer les infos du fichier .env
- exporter le fchier JSON de postman avec toutes les requêtes
  - GET GATEWAY/BILLING/ID redirige vers la Billing API pour récupérer une commande spécifique.

## Utilisation

- ouvre 4 terminal
- déplace toi dans la racine du projet
- lance "vagrant up" sur un seul terminal et laisse charger
- sur chacun des terminal tu ouvres une machine virtuelle
    - gateway
        - vagrant ssh gateway-vm
        - cd /vagrant/srcs/api-gateway
        - node server.js
    - inventory
        - vagrant ssh inventory-vm
        - cd /vagrant/srcs/inventory-app
        - node server.js
    - billing
        - vagrant ssh billing-vm
        - cd /vagrant/srcs/billing-app
        - node server.js