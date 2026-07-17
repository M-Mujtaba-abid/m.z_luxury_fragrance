import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";

const GUEST_COOKIE_NAME = "guestId";
const GUEST_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

// Never blocks the request: sets either req.user (logged in) or req.guestId (guest).
export const identifyUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (user) {
        req.user = user;
        req.guestId = null;
        return next();
      }
    } catch (error) {
      // invalid/expired token -> fall through to guest flow
    }
  }

  let guestId = req.cookies?.[GUEST_COOKIE_NAME];
  if (!guestId) {
    guestId = crypto.randomUUID();
    res.cookie(GUEST_COOKIE_NAME, guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: GUEST_COOKIE_MAX_AGE,
    });
  }

  req.user = null;
  req.guestId = guestId;
  next();
};
