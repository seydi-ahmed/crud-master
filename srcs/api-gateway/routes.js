const express = require('express');
const inventoryProxy = require('./proxy');
const router = express.Router();

// Route for Inventory API
router.use('/api/movies', inventoryProxy);

// Route for Billing API (via RabbitMQ)
router.post('/api/billing', (req, res) => {
  // Logic to send message to RabbitMQ
  res.status(200).json({ message: 'Order received' });
});

module.exports = router;