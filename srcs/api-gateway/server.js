const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use(express.json());
app.use('/api/movies', createProxyMiddleware({
  target: 'http://192.168.56.20:8080', // Adresse de l'Inventory API
  changeOrigin: true,
  pathRewrite: { '^/api/movies': '/api/movies' }, 
  logLevel: 'debug'
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
