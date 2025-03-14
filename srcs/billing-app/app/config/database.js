const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('orders', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;