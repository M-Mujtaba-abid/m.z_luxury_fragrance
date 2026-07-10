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
      type: DataTypes.STRING,
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
      type: DataTypes.ENUM("Men", "Women", "Children"),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.ENUM("15ML", "50ML", "100ML"),
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
  },
  {
    tableName: "Products",
    timestamps: true, // createdAt & updatedAt
  }
);

// agar associations lagani ho
// Product.associate = (models) => {
//   Product.hasMany(models.Order);
// };

export default Product;
