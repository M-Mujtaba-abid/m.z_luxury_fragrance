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
    size: {
      type: DataTypes.ENUM("15ML", "50ML", "100ML"),
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
  },
  {
    tableName: "ProductVariants",
    timestamps: true,
    indexes: [{ unique: true, fields: ["productId", "size"] }],
  }
);

// relations
Product.hasMany(ProductVariant, { foreignKey: "productId", as: "variants" });
ProductVariant.belongsTo(Product, { foreignKey: "productId" });

export default ProductVariant;
