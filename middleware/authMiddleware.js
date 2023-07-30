const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  }

  if (!token) {
    res.json("Not authorised, no token. Please login");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { email } = req.user;
  const user = await User.findOne({ email });
  // console.log(user);
  if (user.role === "admin") {
    next();
  } else {
    throw new Error("You are not an admin");
  }
});

module.exports = { authMiddleware, isAdmin };
