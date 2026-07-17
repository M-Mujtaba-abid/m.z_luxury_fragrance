"use strict";

// Snapshot of the variant's size at purchase time (same idea as the
// existing productName snapshot), so order history reads correctly even if
// the variant row is later edited or deleted.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("OrderItems", "variantSize", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("OrderItems", "variantSize");
  },
};
