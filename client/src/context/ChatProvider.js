import axios from "axios";
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
    const token = JSON.parse(localStorage.getItem("token"));
    const fetchUser = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(
        process.env.REACT_APP_API + "/user/authentication",
        config
      );
      if (res.data?.success) {
        setUser(JSON.parse(localStorage.getItem("userInfo")));
        navigate("/chats");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/");
      }
    };

    if (token) {
      fetchUser();
    } else {
      navigate("/");
    }

    // if (userInfo) {
    //   navigate("/chats");
    // }
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
