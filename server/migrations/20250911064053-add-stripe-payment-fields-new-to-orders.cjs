"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Orders");

    if (!table.paymentStatus) {
      await queryInterface.addColumn("Orders", "paymentStatus", {
        type: Sequelize.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
      });
    }

    if (!table.paymentIntentId) {
      await queryInterface.addColumn("Orders", "paymentIntentId", {
        type: Sequelize.STRING,
      });
    }

    if (!table.transactionId) {
      await queryInterface.addColumn("Orders", "transactionId", {
        type: Sequelize.STRING,
      });
    }

    if (!table.paymentDate) {
      await queryInterface.addColumn("Orders", "paymentDate", {
        type: Sequelize.DATE,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "paymentStatus");
    await queryInterface.removeColumn("Orders", "paymentIntentId");
    await queryInterface.removeColumn("Orders", "transactionId");
    await queryInterface.removeColumn("Orders", "paymentDate");
  },
};
