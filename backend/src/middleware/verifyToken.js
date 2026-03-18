const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { authCookieName } = require("../services/tokenService");

const getTokenFromRequest = (req) => {
  const fromCookie = req.cookies?.[authCookieName];
  if (fromCookie) return fromCookie;

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);

  return null;
};

const verifyToken = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken, getTokenFromRequest };
