import React, { useEffect, useState } from "react";
import GroupChatModal from "../modal/GroupChatModal";
import { ChatState } from "../../context/ChatProvider";
import toast from "react-hot-toast";
import axios from "../../services/customize-axios";
import { getSender, getSenderName } from "../../helper/ChatLogics";
import groupAvatar from "../../assets/images/groupAvatar.png";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatList({ fetchChatsAgain }) {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const [isOpenCreateGroupChatModal, setIsOpenCreateGroupChatModal] =
    useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await axios.get(`/chat`);

        if (data.success) {
          setChats(data.chats);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, [fetchChatsAgain]);

  return (
    <div
      className={`chat-list-container ${
        selectedChat ? "hide-on-tablet" : "show-on-tablet"
      }`}
    >
      <div
        className="d-flex align-items-center justify-content-between g-2"
        style={{ padding: "8px" }}
      >
        <h2 style={{ whiteSpace: "nowrap" }}>My chats</h2>
        <button
          className="btn d-flex align-items-center g-1"
          onClick={() => setIsOpenCreateGroupChatModal(true)}
        >
          <span>New Group Chat</span>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-list-item ${
              chat._id === selectedChat?._id ? "active" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="avatar">
              <img
                src={
                  chat.isGroupChat
                    ? groupAvatar
                    : getSender(user, chat.users).pic
                }
              />
            </div>
            <div className="details">
              <h3>
                {chat.isGroupChat
                  ? chat.chatName
                  : getSenderName(user, chat.users)}
              </h3>
              {chat.latestMessage ? (
                <p>
                  <span>
                    {user._id === chat?.latestMessage?.sender._id
                      ? "You"
                      : chat.latestMessage.sender.name}
                    <span>: </span>
                  </span>
                  {chat.latestMessage.content}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {isOpenCreateGroupChatModal && (
        <GroupChatModal onClose={() => setIsOpenCreateGroupChatModal(false)} />
      )}
    </div>
  );
}
