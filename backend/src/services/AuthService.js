const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

class AuthService {
  async register(userData) {
    const { name, phone, email, password } = userData;

    const existingCustomer = await Customer.findOne({ where: { phone } });
    if (existingCustomer) {
      throw new Error("Phone number already registered");
    }

    if (email) {
      const existingEmail = await Customer.findOne({ where: { email } });
      if (existingEmail) {
        throw new Error("Email already registered");
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    return this.generateTokens(customer);
  }

  async login(phone, password) {
    const customer = await Customer.findOne({ where: { phone } });
    if (!customer) {
      throw new Error("Invalid phone number or password");
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      throw new Error("Invalid phone number or password");
    }

    return this.generateTokens(customer);
  }

  async refreshToken(token) {
    if (!token) throw new Error("No token provided");

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const customer = await Customer.findByPk(decoded.id);

      if (!customer || customer.refresh_token !== token) {
        throw new Error("Invalid refresh token");
      }

      return this.generateTokens(customer);
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  async generateTokens(customer) {
    const accessToken = jwt.sign(
      { id: customer.id, role: customer.role === "admin" ? "admin" : "customer" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    const refreshToken = jwt.sign(
      { id: customer.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
    );

    customer.refresh_token = refreshToken;
    await customer.save();

    const customerPayload = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      role: customer.role === "admin" ? "admin" : "customer",
    };

    return {
      customer: customerPayload,
      user: customerPayload,
      accessToken,
      refreshToken,
    };
  }

  async logout(customerId) {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
      customer.refresh_token = null;
      await customer.save();
    }
  }
}

module.exports = new AuthService();
