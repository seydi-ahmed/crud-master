// crud-master/srcs/billing-app/server.js

const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'orders',
  password: 'diouf',
  port: 5432,
});

// Route pour recevoir les commandes
app.post('/api/orders', async (req, res) => {
  const { user_id, number_of_items, total_amount } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO orders(user_id, number_of_items, total_amount) VALUES($1, $2, $3)',
      [user_id, number_of_items, total_amount]
    );
    res.json({ status: 'Order processed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(7070, () => console.log('Billing service running on port 7070'));