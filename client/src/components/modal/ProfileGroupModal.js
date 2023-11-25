import React from "react";
import UserBadgeItem from "../UserItem/UserBadgeItem";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import axios from "../../services/customize-axios";
import { ChatState } from "../../context/ChatProvider";

export default function ProfileGroupModal({
  onClose,
  fetchChatsAgain,
  setFetchChatsAgain,
}) {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleRemoveUser = async () => {
    try {
      // setLoading(true);
      const data = await axios.put(`/chat/remove-from-group`, {
        chatId: selectedChat._id,
        userId: user._id,
      });

      if (data.success) {
        setSelectedChat(data.chat);
        setFetchChatsAgain(!fetchChatsAgain);
        toast.success("Success to leave group");
        setSelectedChat(null);
      } else {
        toast.error(data.message);
      }
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to leave group");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-wrapper">
        <div className="header">
          <h2>Profile group chat</h2>
          <span className="close-icon" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>

        <div className="content">
          <div className="profile-item">
            <b className="label">Name: </b>
            <p className="decs">{selectedChat.chatName}</p>
          </div>

          <div className="profile-item">
            <b className="label">Admin group: </b>
            <p className="decs">
              <UserBadgeItem user={selectedChat.groupAdmin} />
            </p>
          </div>

          <div className="profile-item">
            <b className="label">Members: </b>
            <div className="decs badge-list">
              {selectedChat.users.map((u) =>
                u._id !== selectedChat.groupAdmin._id ? (
                  <UserBadgeItem key={u._id} user={u} />
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="footer">
          <button className="btn btn-danger" onClick={handleRemoveUser}>
            Leave group
          </button>
        </div>
      </div>
    </div>
  );
}
