const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config"); 

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.decode(token, config.jwtSecret);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res
      .status(401)
      .json({ error: "Token is not valid", details: error.message });
  }
};
