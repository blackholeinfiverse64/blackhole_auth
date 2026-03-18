/**
 * Example integration for a product app (e.g., setu.blackholeinfiverse.com)
 * This lives in the product app repository, not in BHIV Core deployment.
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const { createVerifyUser } = require("../externalAppMiddleware");

const app = express();
app.use(cookieParser());

const verifySetuUser = createVerifyUser({
  jwtSecret: process.env.JWT_SECRET,
  authCookieName: process.env.AUTH_COOKIE_NAME || "bhiv_token",
  appSlug: "setu",
  redirectUrl: "https://products.blackholeinfiverse.com/login"
});

// Protect any product page. Direct URL access works if BHIV cookie is valid.
app.get("/", verifySetuUser, (req, res) => {
  res.send(`
    <h1>Setu</h1>
    <p>Welcome ${req.user.email}</p>
    <a href="https://products.blackholeinfiverse.com/dashboard">Back to Dashboard</a>
  `);
});

app.listen(5001, () => {
  console.log("Setu app running on port 5001");
});
