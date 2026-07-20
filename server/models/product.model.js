import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "not available"),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Men", "Women"),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.ENUM("15ML", "50ML"),
      allowNull: false,
    },

    // 🟢 Homepage Control Fields
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // admin check kare to true hoga
    },
    isNewArrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isOnSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    discountPrice: {
      type: DataTypes.FLOAT,
      allowNull: true, // sirf tab required jab isOnSale true ho
    },

    // 🟢 Catalog metadata (product form: brand/notes/SEO/publish state)
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Fragrance-industry classification, distinct from `category` above:
    // `category` drives storefront navigation (Men/Women sections), `gender`
    // is who the scent is marketed for (a unisex scent can still live under
    // either category section).
    gender: {
      type: DataTypes.ENUM("Men", "Women", "Unisex"),
      allowNull: true,
    },
    topNotes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    heartNotes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    baseNotes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    // Distinct from `status` above, which tracks stock availability, not
    // whether the product is visible on the storefront yet.
    publishStatus: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
  },
  {
    tableName: "Products",
    timestamps: true, // createdAt & updatedAt
  }
);

// price/stock/Quantity above remain the product's own "default" listing so
// products without any configured variants still work in cart/checkout as
// they do today. ProductVariant rows are additional per-size price/stock
// overrides layered on top — see ProductVariant.model.js.
export default Product;
