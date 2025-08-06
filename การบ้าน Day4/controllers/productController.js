const Product = require('../models/productModel');

const productController = {
    // Get all products
    getAllProducts: (req, res) => {
        Product.getAll((err, results) => { // เรียกใช้เมธอด getAll จาก Product Model
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Get product by ID
    getProductById: (req, res) => {
        Product.getById(req.params.id, (err, results) => { // เรียกใช้เมธอด getById จาก Product Model
            if (err) return res.status(500).json({ error: err.message });
            res.json(results[0] || {});
        });
    },

    // Search product by keyword
    searchProducts: (req, res) => {
        const { keyword } = req.params; // ดึง keyword จาก req.params
        Product.searchByKeyword(keyword, (err, results) => { // เรียกใช้เมธอด searchByKeyword จาก Product Model
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    createProduct: (req, res) => {
    const { name, price } = req.body;

    if (!name || price == null) {
        return res.status(400).json({ error: 'name and price are required' });
    }

    Product.create(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: 'Product created'
        });
    });
      },

      // Update product
      updateProduct: (req, res) => {
      const { id } = req.params;
      Product.update(id, req.body, err => { // ส่ง id และ req.body ไปให้เมธอด update ใน Product Model
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product updated' });
      });
      },

      // Soft delete product
      softDeleteProduct: (req, res) => {
      const { id } = req.params;
      Product.softDelete(id, err => { // เรียกใช้เมธอด softDelete จาก Product Model
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product soft-deleted' });
      });
      },

      // Restore product
      restoreProduct: (req, res) => {
      const { id } = req.params;
      Product.restore(id, err => { // เรียกใช้เมธอด restore จาก Product Model
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product restored' });
      });
      },
      
      getProductsView: (req, res) => {
            Product.getAll((err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.render('products', { products: results });
            });
      }
};

module.exports = productController;