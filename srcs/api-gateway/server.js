// crud-master/srcs/api-gateway/server.js

const express = require("express");
const amqp = require("amqplib"); // Ajoutez cette ligne
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Proxy pour Inventory API (HTTP)
app.use(
  "/api/movies",
  createProxyMiddleware({
    target: "http://192.168.56.20:8080",
    changeOrigin: true,
    pathRewrite: { "^/api/movies": "/api/movies" }
  })
);

// Route RabbitMQ pour Billing
app.post("/api/billing", express.json(), async (req, res) => {
  try {
    const conn = await amqp.connect("amqp://192.168.56.30:5672"); 
    const channel = await conn.createChannel();
    
    await channel.assertQueue("billing_queue", { durable: false });
    channel.sendToQueue("billing_queue", Buffer.from(JSON.stringify(req.body)));

    console.log("📨 Message envoyé à RabbitMQ");
    res.status(202).json({ status: "Message reçu par RabbitMQ" });

    setTimeout(() => {
      channel.close();
      conn.close();
    }, 500);
  } catch (err) {
    console.error("Erreur RabbitMQ:", err);
    res.status(502).json({ error: "Service temporairement indisponible" });
  }
});

app.listen(3000, () => console.log("🚀 Gateway sur port 3000"));