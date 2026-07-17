// models/cartItem.model.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";
import User from "../models/user.model.js";
import Product from "./product.model.js";
import ProductVariant from "./productVariant.model.js";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  guestId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Null when the product has no configured variants and is added using its
  // own default price/stock (see product.model.js).
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: { min: 1 },
  },
  priceAtAddition: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "removed", "movedToOrder"),
    defaultValue: "active",
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  validate: {
    hasOwner() {
      if (!this.userId && !this.guestId) {
        throw new Error("CartItem must belong to either a userId or a guestId");
      }
    },
  },
});

// relations
User.hasMany(CartItem, { foreignKey: "userId" });
CartItem.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

ProductVariant.hasMany(CartItem, { foreignKey: "variantId" });
CartItem.belongsTo(ProductVariant, { foreignKey: "variantId" });

export default CartItem;
