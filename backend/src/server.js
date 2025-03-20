const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const ForecastProduct = require('./models/ForecastProduct');

sequelize.sync({ alter: true }) // Ubah ke `{ force: true }` jika ingin reset tabel
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.log('Error:', err));
