export const protectedMiddleware = (req, res, next) => {
  const payload = checkAuthorization(req.cookies);

  if (payload == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
