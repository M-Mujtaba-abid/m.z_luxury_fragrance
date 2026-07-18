"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReviewHelpfulVotes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Reviews", key: "id" },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // A user can only mark a given review helpful once.
    await queryInterface.addIndex("ReviewHelpfulVotes", ["reviewId", "userId"], {
      unique: true,
      name: "review_helpful_votes_review_id_user_id_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ReviewHelpfulVotes");
  },
};
