"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "brand", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "gender", {
      type: Sequelize.ENUM("Men", "Women", "Unisex"),
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "topNotes", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "heartNotes", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "baseNotes", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "metaTitle", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "metaDescription", {
      type: Sequelize.STRING(300),
      allowNull: true,
    });
    await queryInterface.addColumn("Products", "slug", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("Products", "publishStatus", {
      type: Sequelize.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Products", "publishStatus");
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Products_publishStatus";`);
    await queryInterface.removeColumn("Products", "slug");
    await queryInterface.removeColumn("Products", "metaDescription");
    await queryInterface.removeColumn("Products", "metaTitle");
    await queryInterface.removeColumn("Products", "baseNotes");
    await queryInterface.removeColumn("Products", "heartNotes");
    await queryInterface.removeColumn("Products", "topNotes");
    await queryInterface.removeColumn("Products", "gender");
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Products_gender";`);
    await queryInterface.removeColumn("Products", "brand");
  },
};
