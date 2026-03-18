const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    permissions: [{ type: String, required: true, trim: true }]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Role", roleSchema);
