import React, { useEffect, useRef, useState } from "react";
import axios from "../../services/customize-axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderName } from "../../helper/ChatLogics";
import UserModal from "../modal/UserModal";
import UpdateGroupChatModal from "../modal/UpdateGroupChatModal";
import ProfileGroupModal from "../modal/ProfileGroupModal";
import ChatContent from "../ChatContent";
import groupAvatar from "../../assets/images/groupAvatar.png";

// var selectedChatCompare;
export default function ChatBox({ fetchChatsAgain, setFetchChatsAgain }) {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const chatBoxWrapperRef = useRef();
  const selectedChatCompareRef = useRef(selectedChat);

  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API);
    setSocket(newSocket);
    newSocket.emit("setup", user);
    newSocket.on("connected", () => {
      setSocketConnected(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message recieved", (newMessageRecieved) => {
        //if current chat !== chat of message recieved
        if (
          selectedChatCompareRef.current?._id !== newMessageRecieved.chat._id
        ) {
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
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    setTyping(false);
    setMessage("");

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
        toast.error("Fetch messages failed!");
      }
    };
    fetchMessages();

    //su dung cho noti
    selectedChatCompareRef.current = selectedChat;

    if (socket) {
      console.log(
        "chat change",
        selectedChatCompareRef.current?._id,
        selectedChat?._id
      );
      socket.on("typing", (room) => {
        console.log(
          "compare",
          room,
          selectedChatCompareRef.current?._id,
          selectedChat._id,
          room === selectedChat?._id
        );
        if (room === selectedChatCompareRef.current?._id) {
          setTyping(true);
          scrollToBottom();
        }
      });
      socket.on("stop typing", (room) => {
        if (room === selectedChatCompareRef.current?._id) setTyping(false);
      });
    }
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
      toast.error("Error when sending message");
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

  const scrollToBottom = () => {
    chatBoxWrapperRef.current.scrollTop =
      chatBoxWrapperRef.current.scrollHeight;
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
          <div className="chat-box-wrapper" ref={chatBoxWrapperRef}>
            <ChatContent messages={messages} />
            <div>
              {typing ? (
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : null}
            </div>
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
