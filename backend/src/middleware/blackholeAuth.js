const jwt = require("jsonwebtoken");

const COOKIE_NAME = "blackhole_token";

function requireAuth(options = {}) {
  const jwtSecret = options.jwtSecret || process.env.JWT_SECRET;
  const cookieName = options.cookieName || COOKIE_NAME;
  const authServerUrl = options.authServerUrl || process.env.AUTH_SERVER_URL;

  if (!jwtSecret) throw new Error("JWT_SECRET is required");

  return (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) {
      if (req.accepts("json") === "json") {
        return res
          .status(401)
          .json({ error: "Not authenticated", redirect: authServerUrl + "/login" });
      }
      if (authServerUrl) {
        return res.redirect(
          authServerUrl + "/login?redirect=" + encodeURIComponent(req.originalUrl || "/")
        );
      }
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = {
        user_id: decoded.user_id,
        email: decoded.email,
        roles: decoded.roles,
        allowedApps: decoded.allowedApps
      };
      next();
    } catch {
      res.clearCookie(cookieName, { path: "/" });
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

function optionalAuth(options = {}) {
  const jwtSecret = options.jwtSecret || process.env.JWT_SECRET;
  const cookieName = options.cookieName || COOKIE_NAME;

  if (!jwtSecret) throw new Error("JWT_SECRET is required");

  return (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) {
      req.user = null;
      return next();
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = {
        user_id: decoded.user_id,
        email: decoded.email,
        roles: decoded.roles,
        allowedApps: decoded.allowedApps
      };
    } catch {
      req.user = null;
    }
    next();
  };
}

function requireApp(appName) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!req.user.allowedApps?.includes(appName))
      return res.status(403).json({ error: "Access denied" });
    next();
  };
}

module.exports = { requireAuth, optionalAuth, requireApp };
