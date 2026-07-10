"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Orders", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "guestId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "guestEmail", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "guestEmail");
    await queryInterface.removeColumn("Orders", "guestId");
    await queryInterface.changeColumn("Orders", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
