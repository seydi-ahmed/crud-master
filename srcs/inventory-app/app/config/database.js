const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('movies', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;