import axios from "axios";
import React, { useEffect, useState } from "react";
import UserListItem from "../UserItem/UserListItem";
import toast from "react-hot-toast";
import UserBadgeItem from "../UserItem/UserBadgeItem";
import { ChatState } from "../../context/ChatProvider";

export default function GroupChatModal({ onClose }) {
  const [groupChatName, setGroupChatName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { chats, setChats } = ChatState();
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

  //debound search
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      handleSearch(keyword);
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [keyword]);

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.map((user) => user._id).includes(userToAdd._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id != userToRemove._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the field");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        process.env.REACT_APP_API + `/api/chat/create-group`,
        {
          name: groupChatName,
          users: selectedUsers.map((u) => u._id),
        },
        config
      );
      setChats([data.fullGroupChat, ...chats]);
      onClose();
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast("Failed to Create the Chat!");
    }
  };

  return (
    <>
      <div className="modal-container">
        <div className="modal-overlay" onClick={onClose}></div>

        <div className="modal-wrapper">
          <div className="header">
            <h2>Create group chat</h2>
            <span className="close-icon" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </span>
          </div>

          <div className="content">
            <input
              placeholder="Chat name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <input
              placeholder="Add user"
              onChange={(e) => setKeyword(e.target.value)}
            />

            <div className="badge-list">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleClick={() => handleRemoveUser(user)}
                />
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
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
