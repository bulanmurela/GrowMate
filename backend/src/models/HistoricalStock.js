// File: models/HistoricalStock.js
const { DataTypes } = require('sequelize');
// IMPORTANT: Make sure this path to your Sequelize instance is correct!
const sequelize = require('../config/database'); // Or '../config/database_sequelize' or your actual path

const HistoricalStock = sequelize.define('HistoricalStock', {
    // NO separate 'id' PK as per your image.
    // product_name and date form the composite PK.

    product_id: { // This exists in your table
        type: DataTypes.STRING(50), // As per your image: character varying(50)
        allowNull: true, // Or false if it should always be present
                         // Not part of PK based on your image marking
    },
    product_name: {
        type: DataTypes.STRING(255), // As per your image
        allowNull: false,
        primaryKey: true, // Part of composite PK
    },
    date: {
        type: DataTypes.DATEONLY, // 'date' type in DB
        allowNull: false,
        primaryKey: true, // Part of composite PK
    },
    recorded_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    username: { // This exists in your table
        type: DataTypes.STRING(255), // As per your image
        allowNull: true, // Or false if always required
    }
    // Sequelize will manage 'created_at' due to the settings below.
    // If you also have an 'updated_at' column in your DB table, add `updatedAt: 'your_column_name'`
}, {
    tableName: 'stocks',
    timestamps: true,       // Enable timestamps because 'created_at' exists
    createdAt: 'created_at',// Map Sequelize's createdAt to your DB column 'created_at'
    updatedAt: false,       // Disable Sequelize's management of 'updatedAt' IF IT DOESN'T EXIST
                            // If you have an 'updatedAt' column (e.g., 'updated_at'), set: updatedAt: 'updated_at'

    // No need for separate 'indexes' for the PK if product_name and date are marked as primaryKey: true.
    // If product_id should also be unique with them (though not PK), you could add a separate unique index.
});

module.exports = HistoricalStock;