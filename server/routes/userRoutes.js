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

router.get("/authentication", requireSignIn, (req, res) => {
  return res.status(200).send({
    success: true,
    message: "Authentication successful",
  });
});
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/search/:keyword?", requireSignIn, searchUsersController);
router.post("/reset-password", resetPasswordController);
router.get("/reset-password/:id/:token", getResetPasswordController);
router.post("/reset-password/:id/:token", postResetPasswordController);

export default router;
