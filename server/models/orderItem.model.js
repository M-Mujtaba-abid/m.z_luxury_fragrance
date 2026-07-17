// models/orderItem.model.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";
import Order from "./order.model.js";
import Product from "./product.model.js";
import ProductVariant from "./productVariant.model.js";

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  variantId: {
    // optional: null = legacy single-size product, no variant selected
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  variantSize: {
    // snapshot of size at purchase time, so history reads correctly even if the variant is later deleted
    type: DataTypes.STRING,
    allowNull: true,
  },
  productName: {   // snapshot
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: { min: 1 },
  },
  priceAtPurchase: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, { timestamps: true });

// relations
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

ProductVariant.hasMany(OrderItem, { foreignKey: "variantId" });
OrderItem.belongsTo(ProductVariant, { foreignKey: "variantId" });

export default OrderItem;
