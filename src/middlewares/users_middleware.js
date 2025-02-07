import User from "../models/User.js";

export const userMiddleware = async (req, res, next) => {
  try {
    let errors = {};

    if (req.body.email === "") {
      errors.email = "Email is required";
    }
    if (req.body.password === "") {
      errors.password = "Password is required";
    }
    if (req.body.first_name === "") {
      errors.first_name = "First name is required";
    }
    if (req.body.last_name === "") {
      errors.last_name = "Last name is required";
    }

    const user = await new User().fetch({ email: req.body.email });

    if (user) {
      errors.email = "The email address you provided is already taken.";
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({ errors });
    }

    next();
  } catch (error) {
    return res.status(500).json("There was a problem processing the inputs.");
  }
};
