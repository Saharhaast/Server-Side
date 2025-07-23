const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(err => {
  if (err) {
    console.error('ไม่สามารถเชื่อมต่อฐานข้อมูล:', err);
    return;
  }
  console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    res.json(results);
  });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    if (results.length === 0) return res.status(404).json({ error: 'ไม่พบสินค้า' });
    res.json(results[0]);
  });
});

app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.query('SELECT * FROM products WHERE name LIKE ?', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`API รันอยู่ที่ http://localhost:${port}`);
});
