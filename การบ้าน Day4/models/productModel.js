const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // เพิ่ม UUID สำหรับสร้าง ID สินค้าใหม่

const Product = {
  // ดึงข้อมูลสินค้าทั้งหมด
  getAll: (callback) => {
    const query = 'SELECT * FROM products WHERE is_deleted = 0';
    db.query(query, callback);
  },

  // ดึงข้อมูลสินค้าตาม ID
  getById: (id, callback) => {
    const query = 'SELECT * FROM products WHERE id = ? AND is_deleted = 0';
    db.query(query, [id], callback);
  },

  // ค้นหาสินค้าตาม Keyword
  searchByKeyword: (keyword, callback) => {
    const searchTerm = `%${keyword}%`;
    const query = 'SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0';
    db.query(query, [searchTerm], callback);
  },
  // สร้างสินค้าใหม่
  create: (productData, callback) => {
    const { name, price, discount, review_count, image_url } = productData;
    const id = uuidv4(); // สร้าง ID สินค้าใหม่
    const query = 'INSERT INTO products (id, name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [id, name, price, discount, review_count, image_url], callback);
},

    // อัปเดตสินค้า
  update: (id, productData, callback) => {
    const { name, price, discount, review_count, image_url } = productData;
    const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
    db.query(query, [name, price, discount, review_count, image_url, id], callback);
    },

    // Soft Delete สินค้า
  softDelete: (id, callback) => {
    const query = 'UPDATE products SET is_deleted = 1 WHERE id = ?';
    db.query(query, [id], callback);
    },

    // Restore สินค้า
  restore: (id, callback) => {
    const query = 'UPDATE products SET is_deleted = 0 WHERE id = ?';
    db.query(query, [id], callback);
    },

  getProductsView:(callback) => {
    const query = 'SELECT * FROM products WHERE is_deleted = 0';
        db.query(query, callback);
    }
};
module.exports = Product;
