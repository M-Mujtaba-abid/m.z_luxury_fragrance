import ApiError from "./apiError.js";

// Shared by cartItem.service.js and orders.service.js: builds a Sequelize
// where-clause fragment scoped to either the logged-in user or the guest.
const resolveOwner = (userId, guestId) => {
  if (userId) return { userId };
  if (guestId) return { guestId };
  throw new ApiError(401, "Unable to identify cart/order owner");
};

export default resolveOwner;
