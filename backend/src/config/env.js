const dotenv = require("dotenv");

dotenv.config();

const requiredVars = ["MONGO_URI", "JWT_SECRET"];
for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
};

module.exports = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  authCookieName: process.env.AUTH_COOKIE_NAME || "bhiv_token",
  cookieDomain: (process.env.COOKIE_DOMAIN || "").trim(),
  cookieSecure: parseBoolean(process.env.COOKIE_SECURE, false),
  cookieSameSite: process.env.COOKIE_SAME_SITE || "lax",
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
