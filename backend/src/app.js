const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const userRoutes = require('./routes/UserRoutes');
const productRoutes = require('./routes/ProductRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);

sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.error('Database connection error:', err));

// Default Route
app.get('/', (req, res) => {
    res.send('GrowMate API is running...');
});

module.exports = app;
