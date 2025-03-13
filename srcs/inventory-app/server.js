const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 8080;

// Database connection
const sequelize = new Sequelize('movies', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define Movie model
const Movie = sequelize.define('Movie', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
});

// Routes
app.use(express.json());

app.get('/api/movies', async (req, res) => {
  const movies = await Movie.findAll();
  res.json(movies);
});

app.post('/api/movies', async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json(movie);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Inventory API running on port ${PORT}`);
});
