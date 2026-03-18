const jwt = require("jsonwebtoken");

const createVerifyUser = ({
  jwtSecret,
  authCookieName = "bhiv_token",
  appSlug,
  redirectUrl = "https://products.blackholeinfiverse.com"
}) => {
  if (!jwtSecret) throw new Error("jwtSecret is required");
  if (!appSlug) throw new Error("appSlug is required");

  return (req, res, next) => {
    const token =
      req.cookies?.[authCookieName] || req.headers.authorization?.split(" ")[1] || null;

    if (!token) return res.redirect(redirectUrl);

    try {
      const user = jwt.verify(token, jwtSecret);
      if (!user.allowedApps?.includes(appSlug)) return res.status(403).send("Access denied");
      req.user = user;
      return next();
    } catch (error) {
      return res.redirect(redirectUrl);
    }
  };
};

module.exports = { createVerifyUser };
