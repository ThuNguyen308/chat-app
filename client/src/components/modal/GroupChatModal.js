import axios from "../../services/customize-axios";
import React, { useEffect, useState } from "react";
import UserListItem from "../UserItem/UserListItem";
import toast from "react-hot-toast";
import UserBadgeItem from "../UserItem/UserBadgeItem";
import { ChatState } from "../../context/ChatProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function GroupChatModal({ onClose }) {
  const [groupChatName, setGroupChatName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { chats, setChats } = ChatState();

  const handleSearch = async (keyword) => {
    try {
      //   setLoading(true);

      const data = await axios.get(`/user/search/${keyword}`);

      if (data.success) {
        setSearchResult(data.users);
      } else {
        toast.error(data.message);
      }
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
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill all the field");
      return;
    }
    try {
      const data = await axios.post(`/chat/create-group`, {
        name: groupChatName,
        users: selectedUsers.map((u) => u._id),
      });
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
              <span className="close-icon" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
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
