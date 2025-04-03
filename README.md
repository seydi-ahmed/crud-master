# 📌 CRUD-Master

## 📂 Description
CRUD-Master est un projet de microservices qui gère les commandes et l'inventaire d'un service de streaming. Il repose sur un système d'API Gateway, un service d'inventaire et un service de facturation, orchestrés via RabbitMQ et gérés par PM2.

## 🛠 Technologies Utilisées
- **Langages & Frameworks :**
  - JavaScript (Node.js, Express)
  - Shell Script (sh)
- **Outils & Systèmes :**
  - Vagrant (gestion des machines virtuelles)
  - PM2 (gestion des processus Node.js)
  - RabbitMQ (message broker)
  - PostgreSQL (base de données)
  - Postman (test des APIs)
  - VSCode (environnement de développement)

---

## 🚀 Installation et Déploiement

### 📌 1. Lancer l'environnement Vagrant
1. Ouvrir un terminal et naviguer à la racine du projet.
2. Exécuter la commande :
   ```bash
   vagrant up
   ```

### 📌 2. Démarrer les services dans des machines virtuelles
Ouvrir **trois terminaux**, chacun exécutant un microservice distinct :

#### Terminal 1 : API Gateway
```bash
vagrant ssh gateway-vm
cd /vagrant/srcs/api-gateway
pm2 start server.js --name "api-gateway" --watch
```

#### Terminal 2 : Inventory Service
```bash
vagrant ssh inventory-vm
cd /vagrant/srcs/inventory-app
pm2 start server.js --name "inventory-app" --watch
```

#### Terminal 3 : Billing Service
```bash
vagrant ssh billing-vm
cd /vagrant/srcs/billing-app
pm2 start server.js --name "billing-app" --watch
```

### 📌 3. Tester les API avec Postman
1. Ouvrir **Postman**
2. Importer la collection : `MovieStreaming.postman_collection.json`
3. Exécuter les requêtes et vérifier les réponses

---

## 🔧 Commandes Utiles

### 📌 Base de Données (PostgreSQL)
| Commande | Description |
|----------|------------|
| `sudo -i -u postgres` | Passer en mode super-utilisateur PostgreSQL |
| `psql` | Se connecter au serveur PostgreSQL |
| `\l` | Lister toutes les bases de données |
| `\c nom_de_la_base` | Se connecter à une base de données |
| `\d` | Lister les tables de la base de données courante |
| `\d nom_de_la_table` | Voir la structure d'une table |
| `SELECT * FROM nom_de_la_table;` | Voir les entrées d'une table |

### 📌 Gestion de RabbitMQ
| Commande | Description |
|----------|------------|
| `sudo rabbitmqctl list_users` | Lister les utilisateurs RabbitMQ |
| `sudo rabbitmqctl add_user user password` | Ajouter un utilisateur |
| `sudo rabbitmqctl set_permissions -p / user ".*" ".*" ".*"` | Définir les permissions d'un utilisateur |
| `sudo rabbitmqctl list_queues` | Lister les files d'attente |
| `sudo rabbitmqctl list_connections` | Voir les connexions RabbitMQ actives |
| `sudo systemctl restart rabbitmq-server` | Redémarrer RabbitMQ |

### 📌 Gestion des logs et services
| Commande | Description |
|----------|------------|
| `tail -f /var/log/rabbitmq/rabbit@billing-vm.log` | Suivre les logs RabbitMQ |
| `pm2 list` | Lister tous les processus gérés par PM2 |
| `pm2 restart all` | Redémarrer tous les services |
| `pm2 logs` | Voir les logs des services |
| `systemctl status rabbitmq-server` | Vérifier l'état de RabbitMQ |

---

## 🛠 Debugging et Health Checks

### 📌 Vérifier les connexions RabbitMQ
```bash
sudo rabbitmqctl list_connections
```
➡ Permet de voir quels services sont connectés à RabbitMQ.

### 📌 Tester l'API de Health Check
```bash
curl http://192.168.56.30:7070/health
```
➡ Permet de s'assurer que le service **billing** est bien en cours d'exécution.

---

## 👨‍💻 Développeurs

| Nom | Email | GitHub |
|-----|-------|--------|
| **Mouhamed Diouf** | [seydiahmedelcheikh@gmail.com](mailto:seydiahmedelcheikh@gmail.com) | [mouhameddiouf](https://learn.zone01dakar.sn/git/mouhameddiouf) |
| **Abdou Balde** | [abddou.balde@sn.01talent.com](mailto:abddou.balde@sn.01talent.com) | [abdbalde](https://learn.zone01dakar.sn/git/abdbalde) |

---

## 📝 Notes et Améliorations Futures
- [ ] Ajouter des tests unitaires avec Jest
- [ ] Mettre en place un système de monitoring
- [ ] Automatiser le déploiement avec Ansible ou Docker

📌 **Dernier mot :** Ce projet est en constante évolution ! N'hésitez pas à contribuer et proposer des améliorations. 🚀

