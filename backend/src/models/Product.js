const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Image = require('./Image');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    stock: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 0 
    },
    unit_price: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    cogs_per_unit: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    category_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    image_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        references: { 
            model: User, 
            key: 'username' 
        }, 
            onUpdate: 'CASCADE', 
            onDelete: 'CASCADE' 
    }
}, {
    timestamps: true,
    tableName: 'product'
});

// Relasi ke tabel lain
Product.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Product.belongsTo(Image, { foreignKey: 'image_id', onDelete: 'SET NULL' });
Product.belongsTo(User, { foreignKey: 'username', targetKey: 'username', onDelete: 'CASCADE' });

module.exports = Product;
