// Must run after isAuthenticated — relies on req.user already being set.
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.userRole !== "Admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
