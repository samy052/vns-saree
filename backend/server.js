const dns = require("dns");
const cron = require("node-cron");
require("dotenv").config();

const app = require("./src");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 5003;

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const startHeartbeat = () => {
  cron.schedule("*/10 * * * *", () => {
    console.log(`Heartbeat: ${new Date().toISOString()}`);
  });
};

const startServer = async () => {
  try {
    await connectDB();
    startHeartbeat();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
