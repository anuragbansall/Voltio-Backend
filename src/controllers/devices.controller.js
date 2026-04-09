import mongoose from "mongoose";
import Device from "../models/Device.model.js";
import User from "../models/User.model.js";

export const getDevices = async (req, res) => {
  try {
    const { userId } = req.user;

    const devices = await Device.find({ userId }).sort({ lastActive: -1 });

    res.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const { userId } = req.user;
    const deviceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }

    const device = await Device.findOne({ _id: deviceId, userId });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createDevice = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, type, batteryLevel, isCharging } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const newDevice = await Device.create({
      userId,
      name,
      type,
      batteryLevel: batteryLevel || 0,
      isCharging: isCharging || false,
    });

    res.status(201).json(newDevice);
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { userId } = req.user;
    const deviceId = req.params.id;
    const { name, type, batteryLevel, isCharging } = req.body;

    const device = await Device.findOne({ _id: deviceId, userId });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (name) device.name = name;
    if (type) device.type = type;
    if (batteryLevel !== undefined) device.batteryLevel = batteryLevel;
    if (isCharging !== undefined) device.isCharging = isCharging;

    await device.save();

    res.json(device);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const { userId } = req.user;
    const deviceId = req.params.id;

    const device = await Device.findOneAndDelete({ _id: deviceId, userId });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Server error" });
  }
};
