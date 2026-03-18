const Role = require("../models/Role");
const { connectDb } = require("../config/db");
const defaultRoles = require("../constants/defaultRoles");

const seedRoles = async () => {
  await connectDb();
  for (const role of defaultRoles) {
    await Role.updateOne({ name: role.name }, { $set: role }, { upsert: true });
  }
  console.log("Roles seeded successfully");
  process.exit(0);
};

seedRoles().catch((error) => {
  console.error(error);
  process.exit(1);
});
