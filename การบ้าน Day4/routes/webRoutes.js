const express = require('express');
const router = express.Router();

const db = require('../config/db');
const productController = require('../controllers/productController');
const { route } = require('./productRoutes');

router.get('/', productController.getProductsView);

module.exports = router;