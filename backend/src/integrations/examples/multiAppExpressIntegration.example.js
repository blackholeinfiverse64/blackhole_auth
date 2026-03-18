/**
 * Multi-app integration template for product repositories.
 *
 * Use this pattern inside each product app repo to enforce BHIV SSO.
 * One login on products.blackholeinfiverse.com grants access to allowed apps.
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const { createVerifyUser } = require("../externalAppMiddleware");

const app = express();
app.use(cookieParser());

const baseOptions = {
  jwtSecret: process.env.JWT_SECRET,
  authCookieName: process.env.AUTH_COOKIE_NAME || "bhiv_token",
  redirectUrl: "https://products.blackholeinfiverse.com/login"
};

// Create one middleware per app slug.
const appGuards = {
  setu: createVerifyUser({ ...baseOptions, appSlug: "setu" }),
  sampada: createVerifyUser({ ...baseOptions, appSlug: "sampada" }),
  niyantran: createVerifyUser({ ...baseOptions, appSlug: "niyantran" }),
  gurukul: createVerifyUser({ ...baseOptions, appSlug: "gurukul" }),
  mitra: createVerifyUser({ ...baseOptions, appSlug: "mitra" }),
  app06: createVerifyUser({ ...baseOptions, appSlug: "app06" }),
  app07: createVerifyUser({ ...baseOptions, appSlug: "app07" }),
  app08: createVerifyUser({ ...baseOptions, appSlug: "app08" }),
  app09: createVerifyUser({ ...baseOptions, appSlug: "app09" }),
  app10: createVerifyUser({ ...baseOptions, appSlug: "app10" }),
  app11: createVerifyUser({ ...baseOptions, appSlug: "app11" }),
  app12: createVerifyUser({ ...baseOptions, appSlug: "app12" }),
  app13: createVerifyUser({ ...baseOptions, appSlug: "app13" }),
  app14: createVerifyUser({ ...baseOptions, appSlug: "app14" }),
  app15: createVerifyUser({ ...baseOptions, appSlug: "app15" }),
  app16: createVerifyUser({ ...baseOptions, appSlug: "app16" })
};

/**
 * Example:
 * - In Setu repo: protect root route with appGuards.setu
 * - In Sampada repo: protect root route with appGuards.sampada
 * - In App11 repo: protect root route with appGuards.app11
 */
app.get("/", appGuards.setu, (req, res) => {
  res.send(`
    <h1>Setu</h1>
    <p>Welcome ${req.user.email}</p>
    <a href="https://products.blackholeinfiverse.com/dashboard">Back to Dashboard</a>
  `);
});

// Optional generic approach per product repo:
// const appSlug = process.env.APP_SLUG; // e.g. "setu", "app11"
// const verifyCurrentAppUser = createVerifyUser({ ...baseOptions, appSlug });
// app.get("/", verifyCurrentAppUser, (req, res) => res.send("ok"));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(5001, () => {
  console.log("Product app running on port 5001");
});
