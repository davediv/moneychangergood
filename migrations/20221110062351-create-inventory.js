"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("Inventories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usDollar: {
        type: Sequelize.INTEGER,
      },
      britishPoundSterling: {
        type: Sequelize.INTEGER,
      },
      euro: {
        type: Sequelize.INTEGER,
      },
      japaneseYen: {
        type: Sequelize.INTEGER,
      },
      singaporeDollar: {
        type: Sequelize.INTEGER,
      },
      chinaRenminbi: {
        type: Sequelize.INTEGER,
      },
      australianDollar: {
        type: Sequelize.INTEGER,
      },
      canadianDollar: {
        type: Sequelize.INTEGER,
      },
      swissFranc: {
        type: Sequelize.INTEGER,
      },
      hongkongDollar: {
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Inventories");
  },
};
