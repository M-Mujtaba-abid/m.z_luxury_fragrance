'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "paymentStatus", {
      type: Sequelize.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    });
    await queryInterface.addColumn("Orders", "paymentIntentId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "transactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Orders", "paymentDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "paymentStatus").catch(() => {});
    await queryInterface.removeColumn("Orders", "paymentIntentId").catch(() => {});
    await queryInterface.removeColumn("Orders", "transactionId").catch(() => {});
    await queryInterface.removeColumn("Orders", "paymentDate").catch(() => {});
  },
};
