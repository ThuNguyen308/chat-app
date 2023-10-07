import Chat from "../models/ChatModel.js";
import User from "../models/UserModel.js";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChatController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(500)
        .send({ success: false, message: "User not found" });
    }

    //check chat 1-1 exists or not
    let existChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    }).populate("users", "-password");

    //if chat 1-1 not exists
    if (!existChat) {
      let newChat = await Chat.create({
        chatName: "Chat 1-1",
        isGroupChat: false,
        users: [userId, req.user._id],
      });
      newChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).send({ success: true, chat: newChat });
    } else {
      //if chat 1-1 exists => get user sent latest message
      existChat = await User.populate(existChat, {
        path: "lastestmessage.sender",
        select: "name pic email",
      });
      res.status(200).send({ success: true, chat: existChat });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Access chat failed" });
  }
};

const fetchAllChat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send({ success: true, chats: results });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Fetch chats failed" });
  }
};

const createGroupChat = async (req, res) => {
  try {
    if (!req.body.name || !req.body.users) {
      return res
        .status(400)
        .send({ success: false, message: "Please Fill all the field" });
    }

    let users = req.body.users;
    users.push(req.user._id);

    if (users.length < 2) {
      return res.status(400).send({
        success: false,
        message: "More than 2 users are required to form a group chat",
      });
    }

    const createdGroup = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chat.findOne({ _id: createdGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({ success: false, fullGroupChat });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "Create group chat failed" });
  }
};

const deleteGroupChat = async (req, res) => {
  try {
    const existGroup = await Chat.findOne({ _id: req.params.chatId });
    console.log(existGroup);
    // console.log("===", existGroup.groupAdmin.toString());
    // console.log(req.user._id);
    if (existGroup.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(400).send({
        success: false,
        message: "Only admin have right to delete group chat.",
      });
    }
    const deletedGroup = await Chat.deleteOne({ _id: req.params.chatId });
    if (deletedGroup) {
      res.status(200).send({ success: true });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Delete group chat failed" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "Delete group chat failed" });
  }
};

const updateGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the field" });
  }

  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      // .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).send({ success: false, message: "Chat Not Found" });
    } else {
      res.status(200).send({ success: true, updatedChat });
    }
  } catch (e) {
    res.status(404).send({ success: false, message: "Rename Failed" });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(500).send({ success: false, message: "Chat Not Found" });
    } else {
      res.status(200).send({ success: true, chat: removed });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Remove from group failed" });
  }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(500).send({ success: false, message: "Chat Not Found" });
    } else {
      res.status(200).send({ success: true, chat: added });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Add to group failed" });
  }
};

export {
  accessChatController,
  fetchAllChat,
  createGroupChat,
  deleteGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
