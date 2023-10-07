import React from "react";
import { ChatState } from "../../context/ChatProvider";

export default function UserBadgeItem(props) {
  const { user, selectedChat } = ChatState();

  return (
    <div className="badge-item">
      <span>{props.user.name}</span>
      {user._id === selectedChat?.groupAdmin._id ? (
        <i className="fa-solid fa-xmark" onClick={props.handleClick}></i>
      ) : null}
    </div>
  );
}
