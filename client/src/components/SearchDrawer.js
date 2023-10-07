import React, { useEffect, useState } from "react";
import UserListItem from "./UserItem/UserListItem";
import ChatListLoading from "./ChatListLoading";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import toast from "react-hot-toast";

export default function SearchDrawer({ isOpen, onClose }) {
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats, setSelectedChat } = ChatState();

  useEffect(() => {}, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        process.env.REACT_APP_API + `/api/user/search/${keyword}`,
        config
      );

      setSearchResult(data.users);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleAccessChat = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      // setLoadingChat(true);
      const config = {
        headers: {
          // "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        process.env.REACT_APP_API + `/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data.chat._id))
        setChats([data.chat, ...chats]);
      setSelectedChat(data.chat);
      // setLoadingChat(false);
      onClose();
    } catch (error) {
      toast.error("Error access the chat");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="search-drawer-container">
          <div className="overlay" onClick={onClose}></div>
          <div className="search-wrapper">
            <div className="header">
              <h3>Search user</h3>
            </div>
            <div className="body">
              <div className="d-flex g-1">
                <input
                  type="text"
                  className="no-background-color"
                  placeholder="Search by email or name"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="btn" onClick={handleSearch}>
                  Find
                </button>
              </div>
              <div className="search-result">
                {loading ? (
                  <ChatListLoading />
                ) : (
                  <div className="search-result-inner">
                    {searchResult.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleClick={() => handleAccessChat(user._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
