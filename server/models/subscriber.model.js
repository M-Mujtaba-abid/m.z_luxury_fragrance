// models/subscriber.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Subscriber = sequelize.define(
  "Subscriber",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    subscribedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // Random token embedded in the unsubscribe link - lets a subscriber
    // opt out with a single click, no login/auth required.
    unsubscribeToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "subscribers",
    timestamps: true,
  }
);

export default Subscriber;
