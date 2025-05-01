const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('Image', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    code: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    timestamps: false, 
    tableName: 'images'
});

module.exports = Image;
