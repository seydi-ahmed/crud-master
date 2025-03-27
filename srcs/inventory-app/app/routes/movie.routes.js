const express = require('express');
const router = express.Router();
const controller = require('../controllers/movie.controller');

router.get('/', controller.getAllMovies);
router.post('/', controller.createMovie);
router.delete('/', controller.deleteAllMovies);

router.get('/:id', controller.getMovieById);
router.put('/:id', controller.updateMovie);
router.delete('/:id', controller.deleteMovie);

module.exports = router;