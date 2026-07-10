"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "isFeatured", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("Products", "isNewArrival", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("Products", "isOnSale", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("Products", "discountPrice", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "isFeatured");
    await queryInterface.removeColumn("Products", "isNewArrival");
    await queryInterface.removeColumn("Products", "isOnSale");
    await queryInterface.removeColumn("Products", "discountPrice");
  },
};
