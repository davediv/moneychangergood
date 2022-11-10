'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory.belongsTo(models.User)
    }
  }
  Inventory.init({
    usDollar: DataTypes.INTEGER,
    britishPoundSterling: DataTypes.INTEGER,
    euro: DataTypes.INTEGER,
    japaneseYen: DataTypes.INTEGER,
    singaporeDollar: DataTypes.INTEGER,
    chinaRenminbi: DataTypes.INTEGER,
    australianDollar: DataTypes.INTEGER,
    canadianDollar: DataTypes.INTEGER,
    swissFranc: DataTypes.INTEGER,
    hongkongDollar: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Inventory',
  });

  Inventory.beforeCreate((inventory) => {
    inventory.usDollar= 0,
    inventory.britishPoundSterling= 0,
    inventory.euro= 0,
    inventory.japaneseYen= 0,
    inventory.singaporeDollar= 0,
    inventory.chinaRenminbi= 0,
    inventory.australianDollar= 0,
    inventory.canadianDollar= 0,
    inventory.swissFranc= 0,
    inventory.hongkongDollar= 0
  })
  return Inventory;
};