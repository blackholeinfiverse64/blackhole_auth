const checkRole = (...requiredRoles) => (req, res, next) => {
  const userRoles = req.user?.roles || [];
  const hasRole = requiredRoles.some((role) => userRoles.includes(role));
  if (!hasRole) return res.status(403).json({ message: "Insufficient role" });
  return next();
};

const checkPermission = (...requiredPermissions) => (req, res, next) => {
  const userPermissions = req.user?.permissions || [];
  const hasPermission = requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
  if (!hasPermission) return res.status(403).json({ message: "Insufficient permission" });
  return next();
};

module.exports = { checkRole, checkPermission };
