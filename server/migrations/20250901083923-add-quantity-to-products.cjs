"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "Quantity", {
      type: Sequelize.ENUM("15ML", "50ML", "100ML"),
      allowNull: false,
      defaultValue: "15ML", // optional: taake purane rows pe issue na ho
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "Quantity");
  },
};
