const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('movies', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

module.exports = sequelize;