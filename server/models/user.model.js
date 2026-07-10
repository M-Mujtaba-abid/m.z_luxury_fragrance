import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userRole: {
    type: DataTypes.ENUM("User", "Admin"),
    defaultValue: "User",
  },
  profileImage: {
    type: DataTypes.STRING, // store image URL (Cloudinary/local path)
    allowNull: false,
     defaultValue: 'default.jpg',
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
  resetOtp: {
  type: DataTypes.STRING,
  allowNull: true,
},
resetOtpExpiry: {
  type: DataTypes.DATE,
  allowNull: true,
},
}, {
  timestamps: true, // adds createdAt & updatedAt automatically
});

export default User;
