'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      valueSell: {
        type: Sequelize.INTEGER
      },
      valueBuy: {
        type: Sequelize.INTEGER
      },
      country: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Currencies');
  }
};