// crud-master/srcs/api-gateway/server.js

require('dotenv').config();
const express = require('express');
const axios = require('axios'); // Pour les appels HTTP entre services

const app = express();
app.use(express.json());

// Route pour les films (proxy vers Inventory)
app.use('/api/movies', (req, res) => {
  axios({
    method: req.method,
    url: `http://192.168.56.20:8080${req.originalUrl}`,
    data: req.body
  })
  .then(response => res.status(response.status).json(response.data))
  .catch(error => res.status(500).json({ error: "Inventory Service Unavailable" }));
});

// Route simplifiée pour le billing (appel direct HTTP)
app.post('/api/billing', async (req, res) => {
  try {
    const response = await axios.post('http://192.168.56.30:7070/api/orders', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(503).json({ error: "Billing Service Unavailable" });
  }
});

app.listen(3000, () => console.log('Gateway running on port 3000'));