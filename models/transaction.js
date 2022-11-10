'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.belongsTo(models.Currency)
    }
  }
  Transaction.init({
    transactionAmount: DataTypes.INTEGER,
    transactionType: DataTypes.STRING,
    CurrencyId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};