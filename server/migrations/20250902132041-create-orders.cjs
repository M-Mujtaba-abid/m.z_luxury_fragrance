"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shippingStreet: { type: Sequelize.STRING, allowNull: false },
      shippingCity: { type: Sequelize.STRING, allowNull: false },
      shippingState: { type: Sequelize.STRING },
      shippingPostalCode: { type: Sequelize.STRING },
      shippingCountry: { type: Sequelize.STRING, allowNull: false },
      totalAmount: { type: Sequelize.FLOAT, allowNull: false },
      paymentMethod: {
        type: Sequelize.ENUM("COD", "CreditCard", "PayPal", "BankTransfer"),
        defaultValue: "COD",
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "shipped", "delivered", "cancelled"),
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
