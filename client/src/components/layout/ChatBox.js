import React, { useEffect, useRef, useState } from "react";
import axios from "../../services/customize-axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import Lottie from "react-lottie";

import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderName } from "../../helper/ChatLogics";
import UserModal from "../modal/UserModal";
import UpdateGroupChatModal from "../modal/UpdateGroupChatModal";
import ProfileGroupModal from "../modal/ProfileGroupModal";
import ChatContent from "../ChatContent";
import animationData from "../../assets/animations/typing.json";
import groupAvatar from "../../assets/images/groupAvatar.png";

var selectedChatCompare;
export default function ChatBox({ fetchChatsAgain, setFetchChatsAgain }) {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const previosSelectedChat = useRef();
  const [socket, setSocket] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isShowChatList, setIsShowChatList] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API);
    setSocket(newSocket);
    newSocket.emit("setup", user);
    newSocket.on("connected", () => {
      setSocketConnected(true);
    });
    newSocket.on("message recieved", (newMessageRecieved) => {
      //if current chat !== chat of message recieved
      if (selectedChatCompare?._id !== newMessageRecieved.chat._id) {
        //if not exist info chat in notis
        if (
          !notifications
            .map((noti) => noti.chat._id)
            .includes(newMessageRecieved.chat._id)
        ) {
          setNotifications([newMessageRecieved, ...notifications]);
        }
        setFetchChatsAgain(!fetchChatsAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
        setFetchChatsAgain(!fetchChatsAgain);
      }
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const data = await axios.get(`/message/${selectedChat._id}`);
        if (data.success) {
          setMessages(data.messages);
          socket.emit("join chat", selectedChat._id);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Fetch messages failed!");
      }
    };

    fetchMessages();
    //su dung cho noti
    selectedChatCompare = selectedChat;
    if (socket) {
      socket.on("typing", (room) => {
        // console.log(
        //   room,
        //   selectedChatCompare._id,
        //   selectedChat._id,
        //   room === selectedChatCompare._id
        // );
        if (room === selectedChatCompare?._id) setTyping(true);
      });
      socket.on("stop typing", (room) => {
        if (room === selectedChatCompare?._id) setTyping(false);
      });
    }
    setTyping(false);
    setMessage("");
  }, [selectedChat]);

  const handleShowChatList = () => {
    setSelectedChat(null);
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" && message) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    try {
      const data = await axios.post(`/message`, {
        content: message,
        chatId: selectedChat,
      });
      if (data.success) {
        socket.emit("new message", data.message);
        socket.emit("stop typing", selectedChat._id);
        setMessages([...messages, data.message]);
        setMessage("");
        setFetchChatsAgain(!fetchChatsAgain);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = async (value) => {
    setMessage(value);
    if (!socketConnected) return;
    if (value) {
      socket.emit("typing", selectedChat._id);
    } else {
      socket.emit("stop typing", selectedChat._id);
    }
  };

  return (
    <div
      className={`chat-box-container ${
        selectedChat ? "show-on-tablet" : "hide-on-tablet"
      }`}
    >
      {selectedChat ? (
        <>
          {/* Header */}
          <div className="header">
            <div className="header-left">
              <button
                className="btn btn-show-chat-list"
                onClick={handleShowChatList}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div className="avatar">
                <img
                  src={
                    selectedChat.isGroupChat
                      ? groupAvatar
                      : getSender(user, selectedChat.users).pic
                  }
                />
                <i className="fa-solid fa-users"></i>
              </div>
              {selectedChat.isGroupChat ? (
                <span className="name">{selectedChat.chatName}</span>
              ) : (
                <span className="name">
                  {getSenderName(user, selectedChat.users)}
                </span>
              )}
            </div>

            <button className="btn" onClick={() => setIsOpenModal(true)}>
              <i className="fa-solid fa-eye"></i>
            </button>
          </div>

          {/* Content */}
          <div className="chat-box-wrapper">
            <ChatContent messages={messages} />
            {typing ? (
              <div>
                typing
                {/* <Lottie
                  options={defaultOptions}
                  height={30}
                  width={50}
                  style={{ marginBottom: 15, marginLeft: 0, borderRadius: 30 }}
                /> */}
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* Message input */}
          <div className="input-group" style={{ margin: "8px" }}>
            <input
              type="text"
              placeholder="Enter Message"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={handleKeydown}
            />
            <button
              className="btn input-group-btn"
              onClick={handleSendMessage}
              disabled={!message}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          Choose a user to chat
        </div>
      )}

      {isOpenModal ? (
        selectedChat.isGroupChat ? (
          user._id === selectedChat.groupAdmin._id ? (
            <UpdateGroupChatModal
              fetchChatsAgain={fetchChatsAgain}
              setFetchChatsAgain={setFetchChatsAgain}
              onClose={() => setIsOpenModal(false)}
            />
          ) : (
            <ProfileGroupModal
              fetchChatsAgain={fetchChatsAgain}
              setFetchChatsAgain={setFetchChatsAgain}
              onClose={() => setIsOpenModal(false)}
            />
          )
        ) : (
          <UserModal
            user={getSender(user, selectedChat.users)}
            onClose={() => setIsOpenModal(false)}
          />
        )
      ) : null}
    </div>
  );
}
