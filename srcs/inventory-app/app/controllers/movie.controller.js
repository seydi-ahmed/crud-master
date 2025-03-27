const Movie = require('../models/movie.model');

exports.getAllMovies = async (req, res) => {
  try {
    const { title } = req.query;
    const where = title ? { title: { [Sequelize.Op.like]: `%${title}%` } } : {};
    
    const movies = await Movie.findAll({ where });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const [updated] = await Movie.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Movie not found' });
    res.json(await Movie.findByPk(req.params.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllMovies = async (req, res) => {
  try {
    await Movie.destroy({ where: {}, truncate: true });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};