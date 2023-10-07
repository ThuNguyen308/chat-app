import express from "express";
import {
  loginController,
  registerController,
  searchUsersController,
} from "../controllers/userControllers.js";
import requireSignIn from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/search/:keyword?", requireSignIn, searchUsersController);

export default router;
