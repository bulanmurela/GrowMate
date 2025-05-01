// controllers/productController.js
const Product = require('../models/Product');

// Create a product
exports.createProduct = async (req, res) => {
  const { name, category, price, quantity } = req.body;

  try {
    const newProduct = await Product.create({ name, category, price, quantity });
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
