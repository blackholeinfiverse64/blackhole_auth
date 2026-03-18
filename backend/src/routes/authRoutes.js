const express = require("express");
const { login, logout, me, register, ssoSession } = require("../controllers/authController");
const { verifyToken } = require("../middleware/verifyToken");
const { checkAppAccess } = require("../middleware/checkAppAccess");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);
router.get("/sso/session", verifyToken, ssoSession);
router.post("/logout", logout);
router.get("/validate-app/:appName", verifyToken, checkAppAccess(), (req, res) =>
  res.status(200).json({ ok: true, app: req.params.appName })
);

module.exports = router;
