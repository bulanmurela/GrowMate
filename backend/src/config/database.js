const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // database
  process.env.DB_USER,       // username
  process.env.DB_PASSWORD,   // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // opsional: nonaktifkan logging query
  }
);

module.exports = sequelize;
