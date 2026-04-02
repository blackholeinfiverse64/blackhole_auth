const dotenv = require("dotenv");

dotenv.config();

const requiredVars = ["JWT_SECRET"];
for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  authServerUrl: process.env.AUTH_SERVER_URL || "https://bhiv-auth.onrender.com",
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
