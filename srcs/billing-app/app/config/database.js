const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('orders', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;