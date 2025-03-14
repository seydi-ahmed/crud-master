const express = require('express');
const amqp = require('amqplib');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.BILLING_PORT || 8081;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à la base de données PostgreSQL
const sequelize = new Sequelize('orders', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres',
});

// Définition du modèle Order
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
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Synchronisation du modèle avec la base de données
sequelize.sync()
  .then(() => console.log('Base de données synchronisée'))
  .catch(err => console.error('Erreur de synchronisation DB:', err));

// Connexion à RabbitMQ
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'billing_queue';

    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        await Order.create(order);
        channel.ack(msg);
      }
    });

    console.log("Connecté à RabbitMQ et en attente de messages...");
  } catch (error) {
    console.error("Erreur de connexion à RabbitMQ:", error);
  }
}

connectRabbitMQ();

// Routes API

// GET - Récupérer toutes les factures
app.get('/api/billing', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
});

// POST - Créer une nouvelle facture
app.post('/api/billing', async (req, res) => {
  const { user_id, number_of_items, total_amount } = req.body;

  if (!user_id || !number_of_items || !total_amount) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
      const order = await Order.create({
          user_id,
          number_of_items,
          total_amount
      });
      res.status(201).json(order);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Billing API en cours d'exécution sur le port ${PORT}`);
});
