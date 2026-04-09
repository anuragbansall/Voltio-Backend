import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  batteryLevel: {
    type: Number,
    default: 0,
  },
  isCharging: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

deviceSchema.pre("save", async function () {
  this.lastActive = new Date();
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;
