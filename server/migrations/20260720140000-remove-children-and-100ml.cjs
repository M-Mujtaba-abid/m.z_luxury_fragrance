"use strict";

// Drops "Children" from Products.category and "100ML" from Products.Quantity.
// Postgres has no ALTER TYPE ... DROP VALUE, so the safe path is: reassign any
// rows still using the removed value, then rebuild each enum type without it
// (create the smaller type, swap the column to it via a text cast, drop the
// old type, rename the new type into the old type's slot).
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`UPDATE "Products" SET "category" = 'Men' WHERE "category" = 'Children';`);
    await queryInterface.sequelize.query(`UPDATE "Products" SET "Quantity" = '50ML' WHERE "Quantity" = '100ML';`);

    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "category" DROP DEFAULT;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "Quantity" DROP DEFAULT;`);

    // --- category: ENUM('Men','Women','Children') -> ENUM('Men','Women') ---
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Products_category_new" AS ENUM ('Men', 'Women');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "category" TYPE "enum_Products_category_new"
      USING ("category"::text::"enum_Products_category_new");
    `);
    await queryInterface.sequelize.query(`DROP TYPE "enum_Products_category";`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Products_category_new" RENAME TO "enum_Products_category";`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "category" SET DEFAULT 'Men';`);

    // --- Quantity: ENUM('15ML','50ML','100ML') -> ENUM('15ML','50ML') ---
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Products_Quantity_new" AS ENUM ('15ML', '50ML');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "Quantity" TYPE "enum_Products_Quantity_new"
      USING ("Quantity"::text::"enum_Products_Quantity_new");
    `);
    await queryInterface.sequelize.query(`DROP TYPE "enum_Products_Quantity";`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Products_Quantity_new" RENAME TO "enum_Products_Quantity";`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "Quantity" SET DEFAULT '15ML';`);
  },

  // Restores the wider enum shape. Rows reassigned in up() (Children -> Men,
  // 100ML -> 50ML) are not reverted - that data change is intentional.
  async down(queryInterface) {
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "category" DROP DEFAULT;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "Quantity" DROP DEFAULT;`);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Products_category_old" AS ENUM ('Men', 'Women', 'Children');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "category" TYPE "enum_Products_category_old"
      USING ("category"::text::"enum_Products_category_old");
    `);
    await queryInterface.sequelize.query(`DROP TYPE "enum_Products_category";`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Products_category_old" RENAME TO "enum_Products_category";`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "category" SET DEFAULT 'Men';`);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Products_Quantity_old" AS ENUM ('15ML', '50ML', '100ML');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "Quantity" TYPE "enum_Products_Quantity_old"
      USING ("Quantity"::text::"enum_Products_Quantity_old");
    `);
    await queryInterface.sequelize.query(`DROP TYPE "enum_Products_Quantity";`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Products_Quantity_old" RENAME TO "enum_Products_Quantity";`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "Quantity" SET DEFAULT '15ML';`);
  },
};
