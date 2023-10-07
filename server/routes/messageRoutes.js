import express from "express";
import {
  sendMessage,
  fetchMessages,
} from "../controllers/messageControllers.js";
import requireSignIn from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(requireSignIn, sendMessage);
router.route("/:chatId").get(requireSignIn, fetchMessages);

export default router;
