"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("CartItems", "variantId", {
      type: Sequelize.INTEGER,
      allowNull: true, // null = legacy single-size product, no variant selected
      references: { model: "ProductVariants", key: "id" },
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("CartItems", "variantId");
  },
};
