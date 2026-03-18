const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Tenant", tenantSchema);
