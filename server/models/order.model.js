// // models/order.model.js
// import { DataTypes } from "sequelize";
// import {sequelize} from "../config/db.js";
// import User from "./user.model.js";

// const Order = sequelize.define(
//   "Order",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },

//     // snapshot of user info
//     customerName: { type: DataTypes.STRING, allowNull: false },
//     customerEmail: { type: DataTypes.STRING, allowNull: false },
//     customerPhone: { type: DataTypes.STRING, allowNull: false },

//     // shipping address snapshot
//     shippingStreet: { type: DataTypes.STRING, allowNull: false },
//     shippingCity: { type: DataTypes.STRING, allowNull: false },
//     shippingState: { type: DataTypes.STRING },
//     shippingPostalCode: { type: DataTypes.STRING },
//     shippingCountry: { type: DataTypes.STRING, allowNull: false },

//     totalAmount: { type: DataTypes.FLOAT, allowNull: false },
//     paymentMethod: {
//       type: DataTypes.ENUM("COD", "CreditCard", "PayPal", "BankTransfer"),
//       defaultValue: "COD",
//     },
//     status: {
//       type: DataTypes.ENUM(
//         "pending",
//         "confirmed",
//         "shipped",
//         "delivered",
//         "cancelled"
//       ),
//       defaultValue: "pending",
//     },
//   },
//   { timestamps: true }
// );

// // // relation
// User.hasMany(Order, { foreignKey: "userId" });
// Order.belongsTo(User, { foreignKey: "userId" });

// export default Order;



import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // snapshot of user info
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },

    // shipping address snapshot
    shippingStreet: { type: DataTypes.STRING, allowNull: false },
    shippingCity: { type: DataTypes.STRING, allowNull: false },
    shippingState: { type: DataTypes.STRING },
    shippingPostalCode: { type: DataTypes.STRING },
    shippingCountry: { type: DataTypes.STRING, allowNull: false },

    totalAmount: { type: DataTypes.FLOAT, allowNull: false },

    paymentMethod: {
      type: DataTypes.ENUM("COD", "CreditCard", "PayPal", "BankTransfer"),
      defaultValue: "COD",
    },

    // ✅ New fields for Stripe
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    },
    paymentIntentId: { type: DataTypes.STRING },
    transactionId: { type: DataTypes.STRING },
    paymentDate: { type: DataTypes.DATE },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
  },
  { timestamps: true }
);

// relation
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export default Order;
