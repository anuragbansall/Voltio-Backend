import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRouter);

export default app;
