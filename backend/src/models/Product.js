const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    userId: { type: DataTypes.UUID, allowNull: false }
}, {
    timestamps: true,
    tableName: 'products'
});

// Relasi ke User
Product.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Product;
