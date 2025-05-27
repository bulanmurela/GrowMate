const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true, // Jika ingin null ketika tidak ada kategori
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false,
  tableName: 'product',
});

Product.belongsTo(User, {
  foreignKey: 'username',
  targetKey: 'username',
  onDelete: 'CASCADE',
});

module.exports = Product;
