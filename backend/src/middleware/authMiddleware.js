const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const customer = await Customer.findByPk(decoded.id);
    if (!customer) {
      return res.status(401).json({ message: "User not found" });
    }

    req.customer = customer;
    req.user = customer; // For compatibility
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
