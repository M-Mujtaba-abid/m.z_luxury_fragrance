"use strict";

// Production's ProductVariants table was created by an out-of-band process
// (no SequelizeMeta entry, different shape than this repo's migration):
// `size` was an ENUM('15ML','50ML','100ML') instead of free text, and it
// has no `sku` column. Table has 0 rows in production, so the type change
// is safe there. Guarded with existence/type checks so this migration is
// also a safe no-op against a database (e.g. local dev) that was created
// by this repo's own migrations and already has the correct shape.
module.exports = {
  async up(queryInterface, Sequelize) {
    const [[{ data_type: sizeType }]] = await queryInterface.sequelize.query(`
      SELECT data_type FROM information_schema.columns
      WHERE table_name = 'ProductVariants' AND column_name = 'size';
    `);

    if (sizeType === "USER-DEFINED") {
      await queryInterface.sequelize.query(`
        ALTER TABLE "ProductVariants"
        ALTER COLUMN "size" TYPE VARCHAR(255)
        USING ("size"::text);
      `);
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_ProductVariants_size";`);
    }

    const [skuColumn] = await queryInterface.sequelize.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'ProductVariants' AND column_name = 'sku';
    `);

    if (skuColumn.length === 0) {
      await queryInterface.addColumn("ProductVariants", "sku", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ProductVariants", "sku");
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_ProductVariants_size" AS ENUM ('15ML', '50ML', '100ML');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "ProductVariants"
      ALTER COLUMN "size" TYPE "enum_ProductVariants_size"
      USING ("size"::"enum_ProductVariants_size");
    `);
  },
};
