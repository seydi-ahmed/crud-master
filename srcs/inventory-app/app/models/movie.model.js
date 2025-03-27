const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(`postgres://postgres:diouf@localhost:5432/movies`);

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