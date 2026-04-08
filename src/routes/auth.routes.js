import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/profile", authenticateToken, getProfile);

export default authRouter;
