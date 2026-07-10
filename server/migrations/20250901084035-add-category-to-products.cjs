"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "category", {
      type: Sequelize.ENUM("Men", "Women", "Children"),
      allowNull: false,
      defaultValue: "Men", // optional: taake purane rows pe issue na ho
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "category");
  },
};
