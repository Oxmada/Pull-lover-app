import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    dropDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
