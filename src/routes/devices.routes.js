import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/devices.controller.js";

const devicesRouter = express.Router();

devicesRouter.get("/", authenticateToken, getDevices);

devicesRouter.get("/:id", authenticateToken, getDeviceById);

devicesRouter.post("/", authenticateToken, createDevice);

devicesRouter.put("/:id", authenticateToken, updateDevice);

devicesRouter.delete("/:id", authenticateToken, deleteDevice);

export default devicesRouter;
