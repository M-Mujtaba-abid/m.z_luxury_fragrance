"use strict";

// The CartItems half of this repo's original variant-id migration is
// already applied on production (via an out-of-band process); only the
// OrderItems half is actually missing there. Guarded so this is a safe
// no-op against a database (e.g. local dev) where both halves already
// exist.
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existing] = await queryInterface.sequelize.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'OrderItems' AND column_name = 'variantId';
    `);

    if (existing.length === 0) {
      await queryInterface.addColumn("OrderItems", "variantId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "ProductVariants", key: "id" },
        onDelete: "SET NULL",
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("OrderItems", "variantId");
  },
};
