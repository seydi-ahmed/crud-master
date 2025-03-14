const express = require('express');
const amqp = require('amqplib');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.BILLING_PORT || 8081;

// Database connection
const sequelize = new Sequelize('orders', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define Order model
const Order = sequelize.define('Order', {
  user_id: DataTypes.INTEGER,
  number_of_items: DataTypes.INTEGER,
  total_amount: DataTypes.FLOAT,
});

// Connect to RabbitMQ
async function connectRabbitMQ() {
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
}

connectRabbitMQ();

app.listen(PORT, () => {
  console.log(`Billing API running on port ${PORT}`);
});