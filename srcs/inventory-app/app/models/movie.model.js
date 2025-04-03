// crud-master/srcs/inventory-app/app/models/movie.model.js

const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize(`postgres://postgres:diouf@localhost:5432/movies`);
const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB_MOVIES}`);


const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'movies',
  timestamps: false
});

module.exports = Movie;