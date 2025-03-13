const { Order } = require('../models/orderModel');

const processOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    console.log('Order created:', order.toJSON());
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

module.exports = { processOrder };