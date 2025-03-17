// crud-master/srcs/billing-app/app/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders
router.get('/orders', orderController.getAllOrders);

// GET /api/orders/:id
router.get('/orders/:id', orderController.getOrderById);

// POST /api/orders
router.post('/orders', orderController.createOrder);

module.exports = router;