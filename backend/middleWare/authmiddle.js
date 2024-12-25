import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const protect = async (req, res, next) => {
  let token;

  // Check for the token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    
  }

  // If no token is found, return a 401 response
  if (!token) {
    return res.status(404).json({ message: "Not no authorized, no token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "mhcvjmgkuhlihhvmhvjgkg");

    // Find the user and attach it to the request object
    req.user = await User.findById(decoded._id).select("-password");

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
