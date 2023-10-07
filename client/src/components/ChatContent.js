import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { isSenderLastMessage, isUserMessage } from "../helper/ChatLogics";

export default function ChatContent({ messages }) {
  const { user } = ChatState();

  return (
    <>
      {messages.map((m, index) => (
        <div
          key={m._id}
          className={`message-wrapper ${isUserMessage(user, m) ? "user" : ""}`}
        >
          <div className="avatar-wrapper">
            {!isUserMessage(user, m) &&
            isSenderLastMessage(m, messages, index) ? (
              <img className="avatar" src={m.sender.pic} />
            ) : null}
          </div>
          <p className="message">{m.content}</p>
        </div>
      ))}
    </>
  );
}
