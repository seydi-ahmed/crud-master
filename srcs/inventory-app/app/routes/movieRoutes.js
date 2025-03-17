// crud-master/srcs/inventory-app/routes/movieRoutes.js

const express = require('express');
const {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');

const router = express.Router();

router.get('/movies', getAllMovies);
router.post('/movies', createMovie);
router.get('/movies/:id', getMovieById);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

module.exports = router;