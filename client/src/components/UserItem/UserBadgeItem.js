import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UserBadgeItem(props) {
  const { user, selectedChat } = ChatState();

  return (
    <div className="badge-item">
      <span>{props.user.name}</span>
      {user._id === selectedChat?.groupAdmin._id && (
        <FontAwesomeIcon icon={faXmark} onClick={props.handleClick} />
      )}
    </div>
  );
}
