const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

module.exports = sequelize;
