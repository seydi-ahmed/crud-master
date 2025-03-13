const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});