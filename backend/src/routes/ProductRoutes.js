// routes/productRoutes.js
const express = require('express');
const { createProduct, getAllProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');  // Import the auth middleware

const router = express.Router();

// Protect the create product route with authentication
router.post('/', authMiddleware, createProduct);  // Only authenticated users can create products
router.get('/', getAllProducts);  // Public route, no authentication needed

module.exports = router;
