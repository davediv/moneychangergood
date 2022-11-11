'use strict';
const {
  Model, Inventory
} = require('sequelize');
const Bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Inventory)
      User.hasMany(models.Transaction)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email cannot be empty'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        },
        isEmail: true
      
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password cannot be empty'
        },
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: [8, 16]
      }
    },
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    balance: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  // CREATE INVENTORY


  User.beforeCreate(user => {
    const salt = Bcrypt.genSaltSync(12)
    const hash = Bcrypt.hashSync(user.password, salt)

    user.password = hash
    user.balance = 100000000

    // Inventory.create({UserId:user.id})
  })

  
  return User;
};