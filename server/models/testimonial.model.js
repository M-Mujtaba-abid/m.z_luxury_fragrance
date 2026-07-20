// models/testimonial.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Testimonial = sequelize.define(
  "Testimonial",
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
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    thinking: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Public submissions land here inactive; an admin approves them via
    // toggleTestimonialStatus before they appear on the landing page.
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "testimonials",
    timestamps: true,
  }
);

export default Testimonial;
