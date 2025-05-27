const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require('./User');
const Product = require('./Product');

const StockChange = sequelize.define("StockChange", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },  
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
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
  old_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  new_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  change: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

StockChange.belongsTo(User, {
  foreignKey: 'username',
  targetKey: 'username',
  onDelete: 'CASCADE',
});

StockChange.belongsTo(Product, {
  foreignKey: 'product_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

module.exports = StockChange;
