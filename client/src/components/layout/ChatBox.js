import React, { useEffect, useState } from "react";
import axios from "axios";
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

var socket, selectedChatCompare;
export default function ChatBox({ fetchChatsAgain, setFetchChatsAgain }) {
  const { user, selectedChat } = ChatState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const token = localStorage.getItem("token");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_API);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("co nguoi gui tin ne", newMessageRecieved);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give noti
      } else {
        setMessages([...messages, newMessageRecieved]);
        setFetchChatsAgain(!fetchChatsAgain);
      }
    });
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          process.env.REACT_APP_API + `/api/message/${selectedChat._id}`,
          config
        );
        if (data.success) {
          setMessages(data.messages);
          socket.emit("join chat", selectedChat._id);
        }
      } catch (error) {
        console.log(error);
        toast.error("Fetch messages failed!");
      }
    };

    fetchMessages();
    //su dung cho noti
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    setTyping(false);
    if (selectedChat) {
      socket.on("typing", (room) => {
        if (room === selectedChat._id) setTyping(true);
      });
      socket.on("stop typing", (room) => {
        if (room === selectedChat._id) setTyping(false);
      });
    }
  }, [selectedChat]);

  const handleKeydown = (e) => {
    if (e.key === "Enter" && message) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        process.env.REACT_APP_API + `/api/message`,
        {
          content: message,
          chatId: selectedChat,
        },
        config
      );
      if (data.success) {
        socket.emit("new message", data.message);
        socket.emit("stop typing", selectedChat._id);
        setMessages([...messages, data.message]);
        setMessage("");
        setFetchChatsAgain(!fetchChatsAgain);
      }
    } catch (error) {
      toast.error("Error Occured!");
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
    <div className="col-md-9 chat-box-container">
      {selectedChat ? (
        <>
          {/* Header */}
          <div className="header">
            {selectedChat.isGroupChat ? (
              <>
                <span className="name">{selectedChat.chatName}</span>
                {isOpenModal ? (
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
                ) : null}
              </>
            ) : (
              <>
                <span className="name">
                  {getSenderName(user, selectedChat.users)}
                </span>
                {isOpenModal ? (
                  <UserModal
                    user={getSender(user, selectedChat.users)}
                    onClose={() => setIsOpenModal(false)}
                  />
                ) : null}
              </>
            )}

            <button className="btn" onClick={() => setIsOpenModal(true)}>
              <i className="fa-solid fa-eye"></i>
            </button>
          </div>

          {/* Content */}
          <div className="content">
            <ChatContent messages={messages} />
            {typing ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  height={30}
                  width={50}
                  style={{ marginBottom: 15, marginLeft: 0, borderRadius: 30 }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* Message input */}
          <div className="input-group">
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
    </div>
  );
}
