const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

router.use('/api/movies', (req, res, next) => {
  console.log(`🚀 API Gateway reçoit une requête ${req.method} vers /api/movies`);
  console.log(`📦 Body reçu dans API Gateway:`, req.body);
  next();
});

router.use('/api/movies', createProxyMiddleware({
  target: 'http://192.168.56.20:8080',
  changeOrigin: true,
  pathRewrite: { '^/api/movies': '/api/movies' }, 
  logLevel: 'debug' // Ajoute cette ligne pour voir les logs
}));

module.exports = router;
