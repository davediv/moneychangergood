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

    static transactionBuy( currency, amount, user) {
      let total = amount * currency.valueBuy
      
      let balanceResult = user.balance - total
      if (balanceResult < 0){
        return false
      }
    //  console.log(user.Inventory);
      console.log(balanceResult, user.balance, total);
     console.log(user.Inventory[currency.name], amount);
      let inventoryUpdate = user.Inventory[currency.name] += +amount
      user.balance = balanceResult
      let transactionResult = [user.balance, currency.name, inventoryUpdate]
      return transactionResult
    }

    static transactionSell(currency, amount, user) {
      let total = amount * currency.valueBuy
      
      let balanceResult = user.balance + total
      // if (balanceResult < 0){
      //   return false
      // }
    //  console.log(user.Inventory);
    //   console.log(balanceResult, user.balance, total);
    //  console.log(user.Inventory[currency.name], amount);
      let inventoryUpdate = user.Inventory[currency.name] -= +amount

      if(inventoryUpdate < 0){
        return false
      }
      user.balance = balanceResult
      let transactionResult = [user.balance, currency.name, inventoryUpdate]
      return transactionResult
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