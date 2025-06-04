// File: routes/analysisRoutes.js
const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware'); // Your authentication middleware

// Route to get product names for analysis page dropdown
// GET /api/analysis/product-names
router.get('/product-names', authMiddleware, analysisController.getAnalysisProductNames);

// Route to get historical stock data for analysis chart
// GET /api/analysis/stock-trends
router.get('/product-names', authMiddleware, analysisController.getStockTrendsForAnalysis);
router.get('/stock-trends', authMiddleware, analysisController.getStockTrendsForAnalysis);
router.get('/forecast-data', authMiddleware, analysisController.getForecastDataForAnalysis); // NEW ROUTE

module.exports = router;