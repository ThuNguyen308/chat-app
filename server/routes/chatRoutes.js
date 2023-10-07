import express from "express";
import {
  accessChatController,
  fetchAllChat,
  createGroupChat,
  deleteGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} from "../controllers/chatControllers.js";
import requireSignIn from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", requireSignIn, accessChatController);
router.route("/").get(requireSignIn, fetchAllChat);
router.route("/create-group").post(requireSignIn, createGroupChat);
router.route("/delete-group/:chatId").delete(requireSignIn, deleteGroupChat);
router.route("/rename-group").put(requireSignIn, renameGroup);
router.route("/remove-from-group").put(requireSignIn, removeFromGroup);
router.route("/add-to-group").put(requireSignIn, addToGroup);
export default router;
