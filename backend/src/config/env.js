const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: process.env.ENV_FILE || path.resolve(__dirname, "../../.env"),
});

const normalize = (value, fallback = "") => String(value || fallback).trim();

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
};

const nodeEnv = normalize(process.env.NODE_ENV, "development").toLowerCase();
const databaseUrl = normalize(process.env.DATABASE_URL);

process.env.NODE_ENV = nodeEnv;

const config = {
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  isProduction: nodeEnv === "production",
  isTest: nodeEnv === "test",
  port: Number(process.env.PORT || 5003),
  databaseUrl,
  dbSchema: normalize(process.env.DB_SCHEMA, "vns_saree"),
  dbSyncMode: normalize(process.env.DB_SYNC, "none").toLowerCase(),
  dbLogging: parseBoolean(process.env.DB_LOGGING, false),
  dbSsl: normalize(process.env.DB_SSL, "auto").toLowerCase(),
  allowProductionDbSync: parseBoolean(process.env.ALLOW_PRODUCTION_DB_SYNC, false),
  corsOrigins: normalize(process.env.CORS_ORIGINS || process.env.CLIENT_URL || "*"),
  referralSignupBonus: Number(process.env.REFERRAL_SIGNUP_BONUS || 100),
  referralOrderBonus: Number(process.env.REFERRAL_ORDER_BONUS || 50),
  referralOrderDelayDays: Number(process.env.REFERRAL_ORDER_DELAY_DAYS || 7),
};

module.exports = { config, parseBoolean };
