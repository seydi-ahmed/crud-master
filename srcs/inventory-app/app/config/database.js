const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('movies', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;