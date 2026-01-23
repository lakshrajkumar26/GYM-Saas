export const tenantMiddleware = (req, res, next) => {
  const gymIdFromRequest =
    req.body.gymId ||
    req.params.gymId ||
    req.query.gymId;

  // If request doesn't specify gymId, trust JWT
  if (!gymIdFromRequest) return next();

  if (gymIdFromRequest !== req.user.gymId) {
    return res.status(403).json({
      message: "Cross-gym access is not allowed"
    });
  }

  next();
};
