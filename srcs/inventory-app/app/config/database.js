// crud-master/srcs/inventory-app/app/config/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_DB_MOVIES, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});


module.exports = sequelize;