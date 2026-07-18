// models/reviewHelpfulVote.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";
import Review from "./review.model.js";

const ReviewHelpfulVote = sequelize.define(
  "ReviewHelpfulVote",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ReviewHelpfulVotes",
    timestamps: true,
    // A user can only mark a given review helpful once.
    indexes: [{ unique: true, fields: ["reviewId", "userId"] }],
  }
);

// relations
Review.hasMany(ReviewHelpfulVote, { foreignKey: "reviewId" });
ReviewHelpfulVote.belongsTo(Review, { foreignKey: "reviewId" });

User.hasMany(ReviewHelpfulVote, { foreignKey: "userId" });
ReviewHelpfulVote.belongsTo(User, { foreignKey: "userId" });

export default ReviewHelpfulVote;
