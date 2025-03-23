// crud-master/srcs/api-gateway/proxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

const inventoryProxy = createProxyMiddleware({
  target: 'http://192.168.56.20:8080', // Inventory API URL
  changeOrigin: true,
});

const billingProxy = createProxyMiddleware({
  target: 'http://192.168.56.30:8081', // Inventory API URL
  changeOrigin: true,
});

module.exports = {inventoryProxy, billingProxy};