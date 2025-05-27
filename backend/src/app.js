require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const auth = require("./routes/auth");
const ProductRoutes = require("./routes/ProductRoutes");

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Ganti dengan URL frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Jika menggunakan auth seperti JWT
}));
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/users", require('./routes/UserRoutes'));
app.use('/api/products', ProductRoutes);

module.exports = app;

