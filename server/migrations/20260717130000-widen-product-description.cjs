"use strict";

// description was VARCHAR(255), far too small for the rich-text editor's
// HTML output (markup overhead alone can eat most of that budget).
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Products", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Products", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
