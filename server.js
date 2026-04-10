import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Device from "./src/models/Device.model.js";
import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/db/connectDb.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    console.log("User authenticated:", decoded);

    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.userId;

  console.log("Socket connected:", userId);

  // join room
  socket.join(userId);

  socket.on("battery-update", async (data) => {
    const { deviceId, batteryLevel, isCharging } = data;

    console.log("Battery update received:", {
      deviceId,
      batteryLevel,
      isCharging,
    });

    try {
      const device = await Device.findOneAndUpdate(
        { _id: deviceId, userId },
        {
          batteryLevel,
          isCharging,
          lastActive: new Date(),
        },
        { new: true },
      );

      if (!device) {
        console.warn(`Device not found or not owned by user: ${deviceId}`);
        socket.emit("error", {
          message: "Device not found or not owned by user",
        });
        return;
      }

      io.to(userId).emit("device-update", {
        deviceId,
        batteryLevel,
        isCharging,
      });
    } catch (err) {
      console.error("Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", userId);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await connectDb();
  console.log(`Server running on port ${PORT}`);
});
