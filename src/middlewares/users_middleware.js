export const userMiddleware = (req, res, next) => {
  if (req.body.email === "") {
    return res.status(400).json({ message: "Email is required" });
  }
  if (req.body.password === "") {
    return res.status(400).json({ message: "Password is required" });
  }
  if (req.body.first_name === "") {
    return res.status(400).json({ message: "First name is required" });
  }
  if (req.body.last_name === "") {
    return res.status(400).json({ message: "Last name is required" });
  }
  if (req.body.middle_name === "") {
    return res.status(400).json({ message: "Middle name is required" });
  }
  next();
};
