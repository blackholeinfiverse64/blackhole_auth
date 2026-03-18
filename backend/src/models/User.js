const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    roles: [{ type: String, required: true, trim: true }],
    allowedApps: [{ type: String, required: true, trim: true }]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

userSchema.index({ email: 1, tenant_id: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
