const AuthService = require("../services/AuthService");

class AuthController {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.adminLogin(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { token } = req.body;
      const result = await AuthService.refreshToken(token);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email, role } = req.body;
      const result = await AuthService.forgotPassword(email, role);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { email, otp, role } = req.body;
      const result = await AuthService.verifyOTP(email, otp, role);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword, role } = req.body;
      const result = await AuthService.resetPassword(email, otp, newPassword, role);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async logout(req, res) {
    try {
      await AuthService.logout(req.customer.id);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
