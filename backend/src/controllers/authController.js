const bcrypt = require("bcrypt");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const {
  buildJwtPayload,
  signToken,
  attachAuthCookie,
  clearAuthCookie
} = require("../services/tokenService");
const { withTenantFilter } = require("../middleware/tenantScope");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeAppList = (apps = []) =>
  Array.from(new Set((apps || []).map((v) => String(v).trim().toLowerCase()).filter(Boolean)));

const register = async (req, res, next) => {
  try {
    const { email, password, tenantName, roles = ["employee"], allowedApps = [] } = req.body;
    if (!email || !password || !tenantName) {
      return res.status(400).json({ message: "email, password and tenantName are required" });
    }

    let tenant = await Tenant.findOne({ name: tenantName.trim() });
    if (!tenant) {
      tenant = await Tenant.create({ name: tenantName.trim() });
    }

    const cleanEmail = normalizeEmail(email);
    const exists = await User.findOne({ email: cleanEmail, tenant_id: tenant._id });
    if (exists) return res.status(409).json({ message: "User already exists for this tenant" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: cleanEmail,
      password: hashed,
      tenant_id: tenant._id,
      roles,
      allowedApps: normalizeAppList(allowedApps)
    });

    const payload = await buildJwtPayload(user);
    const token = signToken(payload);
    attachAuthCookie(res, token);

    return res.status(201).json({ user: payload });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, tenantName } = req.body;
    if (!email || !password || !tenantName) {
      return res.status(400).json({ message: "email, password and tenantName are required" });
    }

    const tenant = await Tenant.findOne({ name: tenantName.trim() });
    if (!tenant) return res.status(401).json({ message: "Invalid credentials" });

    const user = await User.findOne({ email: normalizeEmail(email), tenant_id: tenant._id });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const payload = await buildJwtPayload(user);
    const token = signToken(payload);
    attachAuthCookie(res, token);

    return res.status(200).json({ user: payload });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const scopedUser = await User.findOne(
      withTenantFilter(req, { _id: req.user.user_id })
    ).select("-password");
    if (!scopedUser) return res.status(404).json({ message: "User not found" });

    const payload = await buildJwtPayload(scopedUser);
    return res.status(200).json({ user: payload });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out from all apps" });
};

const ssoSession = async (req, res, next) => {
  try {
    const app = String(req.query.app || "").trim().toLowerCase();
    if (!app) return res.status(400).json({ message: "Query param 'app' is required" });

    const scopedUser = await User.findOne(
      withTenantFilter(req, { _id: req.user.user_id })
    ).select("-password");
    if (!scopedUser) return res.status(404).json({ message: "User not found" });

    if (!scopedUser.allowedApps?.includes(app)) {
      return res.status(403).json({ message: `Access denied for app '${app}'` });
    }

    const payload = await buildJwtPayload(scopedUser);
    return res.status(200).json({ authenticated: true, app, user: payload });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, me, logout, ssoSession };
