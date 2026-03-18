const checkAppAccess = (resolveAppName) => (req, res, next) => {
  const appName =
    (typeof resolveAppName === "function" ? resolveAppName(req) : null) ||
    req.params.appName ||
    req.query.app ||
    req.headers["x-app-slug"];

  if (!appName) return res.status(400).json({ message: "App name is required" });
  if (!req.user?.allowedApps?.includes(appName)) {
    return res.status(403).json({ message: "Access denied for this app" });
  }
  return next();
};

module.exports = { checkAppAccess };
