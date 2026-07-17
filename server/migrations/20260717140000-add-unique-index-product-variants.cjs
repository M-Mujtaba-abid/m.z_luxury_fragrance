"use strict";

// Two variants of the same product can't share a size string. The table
// itself was already created by an earlier migration without this index.
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex("ProductVariants", ["productId", "size"], {
      unique: true,
      name: "product_variants_product_id_size_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("ProductVariants", "product_variants_product_id_size_unique");
  },
};
