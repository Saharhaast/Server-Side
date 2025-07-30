const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

// เพิ่มตรงนี้เพื่อให้ Express แปลง JSON body
app.use(express.json());

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

// ดึงสินค้าทั้งหมด (ที่ยังไม่ถูกลบ)
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    res.json(results);
  });
});

// ดึงสินค้า 1 ชิ้น
app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    if (results.length === 0) return res.status(404).json({ error: 'ไม่พบสินค้า' });
    res.json(results[0]);
  });
});

// ค้นหาสินค้า
app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    res.json(results);
  });
});

// เพิ่มสินค้า
app.post('/products', (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  const sql = `INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, price, discount || 0, review_count || 0, image_url || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  });
});

// อัปเดตสินค้า
app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, price, discount, review_count, image_url } = req.body;
  db.query(
    'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ? AND is_deleted = 0',
    [name, price, discount, review_count, image_url, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product updated' });
    }
  );
});

// ลบแบบ hard delete
app.delete('/products/:id/hard', (req, res) => {
  const id = req.params.id;
  db.query(
    'DELETE FROM products WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product permanently deleted' });
    }
  );
});


// ลบแบบ soft delete
app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'UPDATE products SET is_deleted = 1 WHERE id = ? AND is_deleted = 0',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Product not found or already deleted' });
      res.json({ message: 'Product soft-deleted' });
    }
  );
});

// Restore กลับมา
app.patch('/products/:id/restore', (req, res) => {
  const id = req.params.id;
  db.query(
    'UPDATE products SET is_deleted = 0 WHERE id = ? AND is_deleted = 1',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Product not found or not deleted' });
      res.json({ message: 'Product restored' });
    }
  );
});
app.listen(port, () => {
  console.log(`API รันอยู่ที่ http://localhost:${port}`);
});