import express from "express";
import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
  checkAuth,
} from "../controllers/Auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const AuthRoutes = express.Router();

AuthRoutes.get("/check-auth", verifyToken, checkAuth);

AuthRoutes.post("/signup", signup);
AuthRoutes.post("/verify-email", verifyEmail);
AuthRoutes.post("/login", login);
AuthRoutes.post("/forgot-password", forgotPassword);
AuthRoutes.post("/reset-password/:token", resetPassword);
AuthRoutes.post("/logout", logout);

export default AuthRoutes;
