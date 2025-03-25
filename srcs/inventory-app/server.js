// crud-master/srcs/inventory-app/server.js

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 8080;

// Connexion à la base de données PostgreSQL
const sequelize = new Sequelize('movies', 'postgres', 'diouf', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => console.log('✅ Connecté à la base de données'))
  .catch(err => console.error('❌ Impossible de se connecter à la base de données:', err));

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT
});

// À ajouter AVANT les routes
app.use((req, res, next) => {
  const originalSend = res.send;
  const originalStatus = res.status;
  
  res.status = function(code) {
    // Transforme 201/202 en 200 (tout le reste inchangé)
    return originalStatus.call(this, [201, 202].includes(code) ? 200 : code);
  };
  
  next();
});

// Appliquer les middlewares
app.use(express.json());

// Routes
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trouvé' });
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du film' });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trouvé' });

    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trouvé' });

    await movie.destroy();
    res.json({ message: 'Film supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/movies', async (req, res) => {
  try {
    await Movie.destroy({ where: {}, truncate: true });
    res.json({ message: 'Tous les films ont été supprimés avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Vérification de la connexion à la BDD avant de démarrer le serveur
sequelize.sync().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Inventory API running on port ${PORT}`);
  });
});

app.use((req, res, next) => {
  console.log(`📥 Inventory API a reçu une requête ${req.method} ${req.url}`);
  console.log(`📦 Body reçu:`, req.body);
  next();
});

app.use(express.json({ limit: '10mb' })); // Augmente la limite de taille des requêtes JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

