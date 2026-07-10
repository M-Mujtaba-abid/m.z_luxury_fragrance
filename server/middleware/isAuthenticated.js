import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token:", decoded);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach full user (without password)
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
