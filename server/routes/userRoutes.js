import express from "express";
import {
  loginController,
  registerController,
  searchUsersController,
  resetPasswordController,
  getResetPasswordController,
  postResetPasswordController,
} from "../controllers/userControllers.js";
import requireSignIn from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/reset-password", resetPasswordController);
router.get("/search/:keyword?", requireSignIn, searchUsersController);
router.get("/reset-password/:id/:token", getResetPasswordController);
router.post("/reset-password/:id/:token", postResetPasswordController);

export default router;
