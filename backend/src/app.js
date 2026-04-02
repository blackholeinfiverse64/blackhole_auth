const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { corsOrigins, jwtSecret, authServerUrl } = require("./config/env");
const { requireAuth, optionalAuth } = require("./middleware/blackholeAuth");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const originAllowed = (origin) => {
  if (!origin || corsOrigins.length === 0) return true;
  return corsOrigins.some((allowed) => {
    if (allowed === origin) return true;
    if (allowed.includes("*")) {
      const regexPattern = `^${allowed.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`;
      return new RegExp(regexPattern).test(origin);
    }
    return false;
  });
};

app.use(
  cors({
    origin(origin, callback) {
      if (originAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"), false);
    },
    credentials: true
  })
);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
  })
);

app.use(optionalAuth({ jwtSecret }));

app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

app.get(
  "/api/me",
  requireAuth({ jwtSecret, authServerUrl }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
