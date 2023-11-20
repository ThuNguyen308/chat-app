import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { isSenderLastMessage, isUserMessage } from "../helper/ChatLogics";

export default function ChatContent({ messages }) {
  const { user } = ChatState();
  const messageEndRef = useRef();

  useEffect(() => {
    const scrollToBottom = () => messageEndRef.current?.scrollIntoView();
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((m, index) => (
        <div
          key={m._id}
          className={`message-item ${isUserMessage(user, m) ? "mine" : ""}`}
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
      <div ref={messageEndRef} />
    </div>
  );
}
