// File: app.js (snippet)
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/ProductRoutes");
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/UserRoutes');
const forecastRoutes = require('./routes/forecastRoutes'); 
const analysisRoutes = require('./routes/analysisRoutes');

// Middleware
app.use(cors({
  origin: 'https://grow-mate-bulanmurelas-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/forecast', forecastRoutes); 
app.use('/api/analysis', analysisRoutes);

// Error handling middleware (example - good to have)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).send('Something broke on the server!');
});

module.exports = app; 
