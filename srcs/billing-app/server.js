// crud-master/srcs/billing-app/server.js

const express = require("express");
const amqp = require("amqplib");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = process.env.BILLING_PORT || 8081;

// À ajouter AVANT les routes
app.use((req, res, next) => {
  const originalSend = res.send;
  const originalStatus = res.status;
  
  res.status = function(code) {
    // Transforme 201/202 en 200 (tout le reste inchangé)
    return originalStatus.call(this, [201, 202].includes(code) ? 200 : code);
  };
  
  next();
});

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à la base de données PostgreSQL
const sequelize = new Sequelize("orders", "postgres", "diouf", {
  host: "localhost",
  dialect: "postgres",
});

// Définition du modèle Order
// Corrigez la définition du modèle Order :
const Order = sequelize.define('Order', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  number_of_items: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  created_at: {  // Ajoutez explicitement ce champ
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false,  // Désactive les champs createdAt/updatedAt automatiques
  underscored: true   // Utilise les noms de colonnes snake_case
});

// Synchronisation du modèle avec la base de données
sequelize
  .sync()
  .then(() => console.log("Base de données synchronisée"))
  .catch((err) => console.error("Erreur de synchronisation DB:", err));

// Connexion à RabbitMQ
// Remplacez la fonction connectRabbitMQ par ceci :
async function connectRabbitMQ() {
  let retries = 5;
  while (retries > 0) {
    try {
      const conn = await amqp.connect('amqp://localhost');
      const channel = await conn.createChannel();
      
      await channel.assertQueue('billing_queue', { durable: false });
      console.log('✅ Connecté à RabbitMQ');

      channel.consume('billing_queue', async (msg) => {
        if (msg) {
          try {
            const order = JSON.parse(msg.content.toString());
            console.log('📦 Message reçu:', order);
            
            // Crée l'ordre en base de données
            await Order.create(order);
            console.log('💾 Ordre sauvegardé en BDD');
            
            channel.ack(msg);
          } catch (err) {
            console.error('❌ Erreur traitement:', err);
          }
        }
      });

      // Gestion des erreurs de connexion
      conn.on('error', (err) => {
        console.error('🚨 Erreur de connexion RabbitMQ:', err);
      });

      return;
    } catch (err) {
      retries--;
      console.error(`Tentative ${5-retries}/5 - Erreur connexion RabbitMQ:`, err.message);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error('Échec de connexion après 5 tentatives');
}
connectRabbitMQ();

// POST - Créer une nouvelle facture
app.post("/api/billing", async (req, res) => {
  const { user_id, number_of_items, total_amount } = req.body;

  if (!user_id || !number_of_items || !total_amount) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const order = await Order.create({
      user_id,
      number_of_items,
      total_amount,
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// startRabbitMQ();

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Billing API en cours d'exécution sur le port ${PORT}`);
});
