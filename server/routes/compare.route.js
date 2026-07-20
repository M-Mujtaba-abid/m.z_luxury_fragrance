import express from "express";
import {
  toggleCompare,
  getUserCompareList,
  removeFromCompare,
  clearCompareList,
} from "../controllers/compare.controller.js";
// This project's real guest/logged-in resolver lives in identifyUser.js
// (sets req.user for a valid token, otherwise issues/reads a guestId
// cookie) - aliased here to the parseUserOrGuest name.
import { identifyUser as parseUserOrGuest } from "../middleware/identifyUser.js";
import { validateProductIdParam } from "../validators/compare.validator.js";

const router = express.Router();

router.post("/toggle/:productId", parseUserOrGuest, validateProductIdParam, toggleCompare);
router.get("/", parseUserOrGuest, getUserCompareList);
router.delete("/:productId", parseUserOrGuest, validateProductIdParam, removeFromCompare);
router.delete("/", parseUserOrGuest, clearCompareList);

export default router;
