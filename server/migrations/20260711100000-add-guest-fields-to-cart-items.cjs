"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("CartItems", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("CartItems", "guestId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("CartItems", "guestId");
    await queryInterface.changeColumn("CartItems", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
