export const authMiddleware = (req, res, next) => {
  if (req.body.email === "" || req.body.email == undefined) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (req.body.password === "" || req.body.password == undefined) {
    return res.status(400).json({ message: "Password is required" });
  }
  next();
};
