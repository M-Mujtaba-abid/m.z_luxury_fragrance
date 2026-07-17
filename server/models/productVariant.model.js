// models/productVariant.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./product.model.js";

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Free text rather than the old Quantity ENUM (15ML/50ML/100ML) — bottle
    // sizes vary per product and shouldn't be capped to a fixed list.
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "ProductVariants",
    timestamps: true,
    // Two variants of the same product can't share a size string.
    indexes: [{ unique: true, fields: ["productId", "size"] }],
  }
);

// No `as:` alias — the admin product form, ListProduct, and
// ProductDetailPage all read the default `product.ProductVariants` include
// key already, so aliasing this would silently break every one of them.
Product.hasMany(ProductVariant, { foreignKey: "productId" });
ProductVariant.belongsTo(Product, { foreignKey: "productId" });

export default ProductVariant;
