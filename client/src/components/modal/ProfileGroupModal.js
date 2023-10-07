import React from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserItem/UserBadgeItem";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProfileGroupModal({
  onClose,
  fetchChatsAgain,
  setFetchChatsAgain,
}) {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleRemoveUser = async () => {
    try {
      const token = localStorage.getItem("token");
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
          userId: user._id,
        },
        config
      );

      if (data.success) {
        setSelectedChat(data.chat);
        setFetchChatsAgain(!fetchChatsAgain);
        toast.success("Success to leave group");
        setSelectedChat(null);
      } else {
        toast.error("Failed to leave group");
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
            <i className="fa-solid fa-xmark"></i>
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
