const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const ForecastProduct = sequelize.define('ForecastProduct', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: { type: DataTypes.UUID, allowNull: false },
    trendScore: { type: DataTypes.INTEGER, allowNull: false },
    recommendation: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true,
    tableName: 'forecast_products'
});

// Relasi ke Produk
ForecastProduct.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = ForecastProduct;
