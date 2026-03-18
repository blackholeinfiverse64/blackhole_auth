const withTenantFilter = (req, filter = {}) => {
  if (!req.user?.tenant_id) return filter;
  return { ...filter, tenant_id: req.user.tenant_id };
};

module.exports = { withTenantFilter };
