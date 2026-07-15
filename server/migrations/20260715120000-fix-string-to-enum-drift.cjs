'use strict';

/**
 * The original create-user/create-product migrations were generated before
 * the models were updated to use ENUM fields, so these three columns ended
 * up as plain VARCHAR while the Sequelize models declare them as ENUM.
 * sequelize.sync({ alter: true }) tries to "fix" this on every server start
 * by issuing SET DEFAULT before ALTER COLUMN TYPE, which fails because
 * Postgres can't auto-cast the old varchar-typed default to the new enum
 * type. This migration does it in the safe order instead: convert the
 * column type first (while it has no default yet), then set the default
 * afterward once the column is already enum-typed.
 */
module.exports = {
  async up(queryInterface) {
    // --- Users.userRole: STRING -> ENUM('User', 'Admin'), default 'User' ---
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Users_userRole" AS ENUM ('User', 'Admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users"
      ALTER COLUMN "userRole" TYPE "enum_Users_userRole"
      USING ("userRole"::text::"enum_Users_userRole");
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "userRole" SET DEFAULT 'User';
    `);

    // --- Users.status: STRING -> ENUM('active', 'inactive'), default 'active' ---
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Users_status" AS ENUM ('active', 'inactive');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users"
      ALTER COLUMN "status" TYPE "enum_Users_status"
      USING ("status"::text::"enum_Users_status");
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "status" SET DEFAULT 'active';
    `);

    // --- Products.status: STRING -> ENUM('available', 'not available'), NOT NULL (matches model, no default) ---
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Products_status" AS ENUM ('available', 'not available');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "status" TYPE "enum_Products_status"
      USING ("status"::text::"enum_Products_status");
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Products" ALTER COLUMN "status" SET NOT NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "status" DROP NOT NULL;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Products" ALTER COLUMN "status" TYPE VARCHAR(255) USING ("status"::text);`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Products_status";`);

    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "status" DROP DEFAULT;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "status" TYPE VARCHAR(255) USING ("status"::text);`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_status";`);

    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "userRole" DROP DEFAULT;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ALTER COLUMN "userRole" TYPE VARCHAR(255) USING ("userRole"::text);`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_userRole";`);
  },
};
