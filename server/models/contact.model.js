// models/contact.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "replied"),
      allowNull: false,
      defaultValue: "pending",
    },
    adminReply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "contacts",
    timestamps: true,
  }
);

export default Contact;
