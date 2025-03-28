# crud-master

## utilisation
1) Ouvrir 3 terminals à la racine du projet
2) Faire "vagrant up" sur le vscode ou un 4e terminal
3) Ouvrir une machine virtuelle sur chacune des 3 terminal:
- terminal 1(gateway):
    - vagrant ssh gateway-vm
    - cd /vagrant/srcs/api-gateway
    - pm2 start server.js --name "api-gateway" --watch
- terminal 2(inventory):
    - vagrant ssh inventory-vm
    - cd /vagrant/srcs/inventory-app
    - pm2 start server.js --name "inventory-app" --watch
- terminal 3(billing):
    - vagrant ssh billing-vm
    - cd /vagrant/srcs/billing-app
    - pm2 start server.js --name "billing-app" --watch

## développeur:
1) Mouhamed Diouf
- mail: seydiahmedelcheikh@gmail.com
- git: mouhameddiouf
2) Abdou Balde
- mail: 
- git: abdbalde


- vérification de la BD
- sudo -i -u postgres
- puis psql
- \c movies
- table movies;
