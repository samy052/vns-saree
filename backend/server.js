const dns = require("dns");
const cron = require("node-cron");
require("dotenv").config();

const app = require("./src");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 5003;

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Health Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

const startHeartbeat = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const response = await fetch(
        "https://vns-saree.onrender.com/health"
      );


      console.log(
        `Heartbeat sent at ${new Date().toISOString()} | Status: ${response.status}`
      );
    } catch (error) {
      console.error("Heartbeat failed:", error.message);
    }
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