const jwt = require("jsonwebtoken");
const Role = require("../models/Role");
const { authCookieName, cookieDomain, cookieSameSite, cookieSecure, jwtExpiresIn, jwtSecret } = require("../config/env");

const getPermissionsForRoles = async (roles) => {
  const records = await Role.find({ name: { $in: roles } }).lean();
  const permissions = new Set();
  for (const role of records) {
    for (const permission of role.permissions || []) permissions.add(permission);
  }
  return Array.from(permissions);
};

const buildJwtPayload = async (user) => {
  const permissions = await getPermissionsForRoles(user.roles || []);
  return {
    user_id: user._id,
    email: user.email,
    tenant_id: user.tenant_id,
    roles: user.roles || [],
    permissions,
    allowedApps: user.allowedApps || []
  };
};

const signToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

const cookieOptions = () => {
  const options = {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    path: "/"
  };
  if (cookieDomain) options.domain = cookieDomain;
  return options;
};

const attachAuthCookie = (res, token) => {
  res.cookie(authCookieName, token, {
    ...cookieOptions(),
    maxAge: 1000 * 60 * 60 * 8
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(authCookieName, cookieOptions());
};

module.exports = {
  authCookieName,
  getPermissionsForRoles,
  buildJwtPayload,
  signToken,
  attachAuthCookie,
  clearAuthCookie
};
