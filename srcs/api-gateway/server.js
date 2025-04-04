// crud-master/srcs/api-gateway/server.js

require("dotenv").config();

const express = require("express");
const axios = require("axios");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

// Configuration RabbitMQ
const RABBIT_CONFIG = {
  url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.BILLING_API_URL}`,
  queue: process.env.RABBITMQ_QUEUE,
  timeout: 5000,
};

let channel;

// Connexion RabbitMQ persistante
const connectRabbitMQ = async () => {
  try {
    const conn = await amqp.connect(RABBIT_CONFIG.url);
    channel = await conn.createChannel();
    await channel.assertQueue(RABBIT_CONFIG.queue, { durable: true });
    console.log("✅ Connected to RabbitMQ");

    conn.on("close", () => {
      console.log("RabbitMQ connection closed, reconnecting...");
      setTimeout(connectRabbitMQ, 5000);
    });

    return channel;
  } catch (err) {
    console.error("RabbitMQ connection error:", err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
};

connectRabbitMQ();

// Route pour les films (proxy vers Inventory)
app.use("/api/movies", (req, res) => {
  console.log(req.originalUrl);

  axios({
    method: req.method,
    url: `${process.env.INVENTORY_API_URL}:${process.env.INVENTORY_PORT}${req.originalUrl}`,
    data: req.body,
  })
    .then((response) => res.status(200).json(response.data))
    .catch((error) =>
      res.status(200).json({ error: "Inventory Service Unavailable" })
    );
});

// Nouvelle route billing avec RabbitMQ
app.post("/api/billing", async (req, res) => {
  if (!channel) {
    return res.status(200).json({
      status: "queued",
      warning: "Processing delayed - reconnecting to queue",
    });
  }

  try {
    const message = {
      ...req.body,
      timestamp: new Date().toISOString(),
    };

    channel.sendToQueue(
      RABBIT_CONFIG.queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    res.status(200).json({
      status: "success",
      message: "Order received for processing",
    });
  } catch (err) {
    res.status(200).json({
      status: "error",
      error: "Queue system temporarily unavailable",
    });
  }
});

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Gateway running on http://0.0.0.0:${PORT}`);
});
