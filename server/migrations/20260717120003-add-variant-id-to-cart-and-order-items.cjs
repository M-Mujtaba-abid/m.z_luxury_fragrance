"use strict";

// Nullable: existing CartItems/OrderItems predate variants, and a product
// with no variants configured yet still needs to be addable to cart using
// its own price/stock (see product.model.js comment on backward compat).
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("CartItems", "variantId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "ProductVariants", key: "id" },
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("OrderItems", "variantId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "ProductVariants", key: "id" },
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("OrderItems", "variantId");
    await queryInterface.removeColumn("CartItems", "variantId");
  },
};
