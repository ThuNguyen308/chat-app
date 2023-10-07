import axios from "axios";
import React, { useState } from "react";
import UserListItem from "../UserItem/UserListItem";
import toast from "react-hot-toast";
import UserBadgeItem from "../UserItem/UserBadgeItem";
import { ChatState } from "../../context/ChatProvider";

export default function UpdateGroupChatModal({
  onClose,
  fetchChatsAgain,
  setFetchChatsAgain,
}) {
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoadingRename, setIsLoadingRename] = useState(false);
  const token = localStorage.getItem("token");

  const handleSearch = async (keyword) => {
    try {
      //   setLoading(true);

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
    // setLoading(false);
  };

  const handleAddUser = async (userToAdd) => {
    try {
      if (selectedChat.users.map((user) => user._id).includes(userToAdd._id)) {
        toast.error("User already added");
        return;
      }

      // setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        process.env.REACT_APP_API + `/api/chat/add-to-group`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      if (data.success) {
        setSelectedChat(data.chat);
        setFetchChatsAgain(!fetchChatsAgain);
        toast.success("Success to add");
      } else {
        toast.error("Failed to add user");
      }
      // setLoading(false);
    } catch (error) {
      toast.error("Failed to add user");
    }
    // setLoading(false);
  };

  const handleRemoveUser = async (userToRemove) => {
    try {
      // setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        process.env.REACT_APP_API + `/api/chat/remove-from-group`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      if (data.success) {
        setSelectedChat(data.chat);
        setFetchChatsAgain(!fetchChatsAgain);
        toast.success("Success to remove user");
      } else {
        toast.error("Failed to remove user");
      }
      // setLoading(false);
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  const handleRename = async () => {
    setIsLoadingRename(true);
    if (!groupChatName) {
      toast.error("Please fill field name");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        process.env.REACT_APP_API + `/api/chat/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      if (data.success) {
        setSelectedChat(data.updatedChat);
        setFetchChatsAgain(!fetchChatsAgain);
        onClose();
        toast.success("Rename success!");
      } else {
        toast.error("Failed to Rename the Group chat!");
      }
    } catch (error) {
      toast.error("Failed to Rename the Group chat!");
    }
    setIsLoadingRename(false);
  };

  const deleteGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(
        process.env.REACT_APP_API +
          `/api/chat/delete-group/${selectedChat._id}`,
        config
      );
      if (data.success) {
        setSelectedChat(data.updatedChat);
        setFetchChatsAgain(!fetchChatsAgain);
        onClose();
        toast.success("Delete group success!");
      } else {
        toast.error("Failed to Delete group!");
      }
    } catch (error) {
      toast.error("Failed to Delete group!");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-wrapper">
        <div className="header">
          <h2>Update group chat</h2>
          <span className="close-icon" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="content">
          <div className="input-group">
            <input
              placeholder="Chat name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              className="btn btn-primary"
              disabled={isLoadingRename}
              onClick={handleRename}
            >
              Rename
            </button>
          </div>
          <input
            placeholder="Add user"
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="badge-list">
            {selectedChat.users.map((user) => (
              <>
                {user._id !== selectedChat.groupAdmin._id ? (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleClick={() => handleRemoveUser(user)}
                  />
                ) : null}
              </>
            ))}
          </div>

          <div className="search-result-inner">
            {searchResult.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleClick={() => handleAddUser(user)}
              />
            ))}
          </div>
        </div>

        <div className="footer">
          <button className="btn btn-danger" onClick={deleteGroup}>
            Delete group
          </button>
        </div>
      </div>
    </div>
  );
}
