// crud-master/srcs/api-gateway/server.js

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const RABBITMQ_HOST = "amqp://admin:admin@127.0.0.1:5672/";

app.use(
  "/api/movies",
  createProxyMiddleware({
    target: "http://192.168.56.20:8080",
    changeOrigin: true,
    pathRewrite: { "^/api/movies": "/api/movies" },
    logLevel: "debug", // Ajoute des logs détaillés
    onProxyReq: (proxyReq, req, res) => {
      console.log("🛰 Envoi de la requête au backend:", req.method, req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        "📩 Réponse reçue du backend avec statut:",
        proxyRes.statusCode
      );
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error:", err.message);
      res
        .status(502)
        .json({ error: "Problème de communication avec le backend" });
    },
  })
);

// Proxy pour Billing API
app.use(
  "/api/billing",
  createProxyMiddleware({
    target: "http://192.168.56.30:8081", // Adresse IP et port de l'API Billing
    changeOrigin: true,
    pathRewrite: { "^/api/billing": "/api/billing" },
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log("Envoi de la requête à Billing API:", req.method, req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        "Réponse reçue de Billing API avec statut:",
        proxyRes.statusCode
      );
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error Billing API:", err.message);
      res
        .status(502)
        .json({ error: "Problème de communication avec Billing API" });
    },
  })
);

app.listen(3000, () => {
  console.log("🚀 API Gateway running on port 3000");
});
