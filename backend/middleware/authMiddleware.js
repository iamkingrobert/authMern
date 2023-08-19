import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Middleware to protect routes with authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Retrieve the JWT token from the 'jwt' cookie in the request
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the JWT token using the secret key (process.env.JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user using the decoded user ID from the token and exclude the password field
      req.user = await User.findById(decoded.userId).select("-password");
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // If token verification fails, send a 401 Unauthorized response with an error message
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    // If no token is present, send a 401 Unauthorized response with an error message
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
