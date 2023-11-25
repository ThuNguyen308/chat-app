import axios from "../services/customize-axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await axios.get("user/authentication");
      if (data.success) {
        setUser(JSON.parse(localStorage.getItem("userInfo")));
        navigate("/chats");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/");
      }
    };

    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      navigate("/");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notifications,
        setNotifications,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
