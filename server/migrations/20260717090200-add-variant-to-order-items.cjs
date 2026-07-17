"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("OrderItems", "variantId", {
      type: Sequelize.INTEGER,
      allowNull: true, // null = legacy single-size product, no variant selected
      references: { model: "ProductVariants", key: "id" },
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("OrderItems", "variantSize", {
      type: Sequelize.STRING,
      allowNull: true, // snapshot so order history survives variant deletion
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("OrderItems", "variantId");
    await queryInterface.removeColumn("OrderItems", "variantSize");
  },
};
