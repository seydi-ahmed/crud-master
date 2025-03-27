# billing
```
npm install axios pg
sudo apt update && sudo apt install -y rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management
sudo rabbitmqctl add_user gateway diouf
sudo rabbitmqctl set_user_tags gateway administrator
sudo rabbitmqctl set_permissions -p / gateway ".*" ".*" ".*"
```
```
listeners.tcp.default = 5672
loopback_users = none
```
```
sudo nano /etc/rabbitmq/rabbitmq.conf
mettez ceci:
# Autorise toutes les connexions
loopback_users = none
# Force l'écoute sur toutes les interfaces
listeners.tcp.default = 5672
```
```
sudo systemctl restart rabbitmq-server
```
```
# Création du fichier de configuration
sudo tee /etc/rabbitmq/rabbitmq.conf <<EOF
loopback_users = none
listeners.tcp.default = 5672
default_pass = diouf
default_user = guest
EOF

# Redémarrage du service
sudo systemctl restart rabbitmq-server

# Vérification
sudo rabbitmqctl status | grep listeners
# Doit afficher : listeners, port: 5672
```
```
sudo tee /etc/rabbitmq/rabbitmq-env.conf <<EOF
NODE_IP_ADDRESS=0.0.0.0
NODE_PORT=5672
EOF
sudo systemctl restart rabbitmq-server
```

# gateway
```
npm install
npm install amqplib@0.10.3 http-proxy-middleware@2.0.6
npm install axios pg
```

# inventory
```
sudo ufw allow 8080/tcp
ou
sudo ufw disable
```

# sur toutes les machines
```
pkill node
npm install axios pg
```

# virtualbox
- vboxmanage list vms
- vboxmanage unregistervm "Nom-de-la-VM" --delete
- vagrant global-status --prune | awk '/virtualbox/{print $1}' | xargs -L 1 vagrant destroy -f

# Test
```
curl -X POST http://192.168.56.10:3000/api/billing \
  -H "Content-Type: application/json" \
  -d '{"user_id": "23", "total_amount": 150}'
```