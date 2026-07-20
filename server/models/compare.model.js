// models/compare.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";
import Product from "./product.model.js";

const Compare = sequelize.define(
  "Compare",
  {
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
  },
  {
    tableName: "compares",
    timestamps: true,
    validate: {
      hasOwner() {
        if (!this.userId && !this.guestId) {
          throw new Error("Compare item must belong to either a userId or a guestId");
        }
      },
    },
  }
);

// relations
User.hasMany(Compare, { foreignKey: "userId" });
Compare.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Compare, { foreignKey: "productId" });
Compare.belongsTo(Product, { foreignKey: "productId" });

export default Compare;
