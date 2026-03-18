module.exports = [
  {
    name: "admin",
    permissions: ["users:read", "users:write", "apps:read", "apps:launch", "roles:manage"]
  },
  {
    name: "manager",
    permissions: ["users:read", "apps:read", "apps:launch"]
  },
  {
    name: "employee",
    permissions: ["apps:read", "apps:launch"]
  },
  {
    name: "system_agent",
    permissions: ["apps:read", "apps:launch", "system:sync"]
  }
];
