// File: routes/forecastRoutes.js
const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController'); // Your controller for this
const authMiddleware = require('../middleware/authMiddleware');     // Your auth middleware

// The actual route definition
router.post('/generate', authMiddleware, forecastController.generateForecasts);

module.exports = router;