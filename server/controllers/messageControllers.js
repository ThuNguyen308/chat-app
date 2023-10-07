import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";

const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).send({
        success: false,
        message: "Invalid data. Fail to send message!",
      });
    }

    let newMessage = {
      chat: chatId,
      content: content,
      sender: req.user._id,
    };

    newMessage = await Message.create(newMessage);
    newMessage = await newMessage.populate("sender", "-password");
    newMessage = await newMessage.populate("chat");
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    res.status(201).send({ success: true, message: newMessage });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: newMessage,
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: "Fail to send message!",
    });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({
        createdAt: 1,
      })
      .populate("sender", "-password")
      .populate("chat");
    res.status(200).send({ success: true, messages: messages });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: "Fail to fetch messages!",
    });
  }
};

export { sendMessage, fetchMessages };
