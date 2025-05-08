// routes/trendRoutes.js
const express = require('express');
const { getTrends } = require('../controllers/trendController');
const authMiddleware = require('../middleware/authMiddleware');  // Import auth middleware

const router = express.Router();

// Protect the Google Trends route with authentication
router.get('/', authMiddleware, getTrends);

module.exports = router;
