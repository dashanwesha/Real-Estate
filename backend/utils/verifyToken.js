// utils/verifyToken.js
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token:", token); // For debugging

  if (!token) {
    // If no token is provided, return an Unauthorized response
    return next(errorHandler(401, "No token provided, unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err); // For debugging

      if (err.name === 'TokenExpiredError') {
        // Specific handling for expired tokens
        return next(errorHandler(403, "Token expired, please log in again"));
      }

      // Handle other verification errors
      return next(errorHandler(403, "Invalid token"));
    }

    // Token is valid
    req.user = user;
    next();
  });
};
