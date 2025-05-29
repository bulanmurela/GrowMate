// File: routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path if necessary

// Frontend calls: POST /api/stocks/record-daily
// This router is mounted at /api/stocks in app.js, so the path here is /record-daily
router.post('/record-daily', authMiddleware, stockController.recordDailyStocks);

module.exports = router;