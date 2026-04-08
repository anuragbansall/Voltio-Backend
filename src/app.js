import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRouter);

export default app;
