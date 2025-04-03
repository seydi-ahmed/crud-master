// crud-master/srcs/billing-app/server.js

const express = require("express");
const { Pool } = require("pg");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

// Configuration PostgreSQL
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "orders",
//   password: "diouf",
//   port: 5432,
// });

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB_ORDERS,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});


// Configuration RabbitMQ
// const RABBIT_CONFIG = {
//   url: "amqp://gateway:diouf@localhost",
//   queue: "billing_queue"
// };


const RABBIT_CONFIG = {
  url: process.env.BILLING_API_URL.replace("amqp://", `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@`),
  queue: process.env.RABBITMQ_QUEUE
};



// Consumer RabbitMQ
const startConsumer = async () => {
  let conn, channel;

  try {
    conn = await amqp.connect(RABBIT_CONFIG.url);
    channel = await conn.createChannel();
    
    await channel.assertQueue(RABBIT_CONFIG.queue, { durable: true });
    channel.prefetch(1);

    console.log("🔄 Billing worker ready. Waiting for messages...");

    channel.consume(RABBIT_CONFIG.queue, async (msg) => {
      if (!msg) return;

      try {
        const order = JSON.parse(msg.content.toString());
        console.log("Processing order:", order.user_id);

        await pool.query(
          "INSERT INTO orders(user_id, number_of_items, total_amount, created_at) VALUES($1, $2, $3, $4)",
          [order.user_id, order.number_of_items || 1, order.total_amount, order.timestamp || new Date()]
        );

        channel.ack(msg);
        console.log(`✅ Order ${order.user_id} processed`);
      } catch (err) {
        console.error("❌ Processing failed:", err);
        channel.nack(msg, false, true); // Réessayer plus tard
      }
    });

    conn.on("close", () => {
      console.log("RabbitMQ connection closed, reconnecting...");
      setTimeout(startConsumer, 5000);
    });

  } catch (err) {
    console.error("Consumer setup failed:", err);
    if (channel) await channel.close();
    if (conn) await conn.close();
    setTimeout(startConsumer, 5000);
  }
};

// Démarrer le consumer
startConsumer();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "running" });
});

// app.listen(7070, "0.0.0.0", () => {
//   console.log("💰 Billing service running on http://192.168.56.30:7070");
// });

const PORT = process.env.BILLING_PORT || 7070;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`💰 Billing service running on port ${PORT}`);
});
