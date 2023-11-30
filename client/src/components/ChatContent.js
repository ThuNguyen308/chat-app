import React, { useEffect, useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  isSenderLastMessage,
  isUserMessage,
  isSenderFirstMessage,
} from "../helper/ChatLogics";

export default function ChatContent({ messages }) {
  const { user, selectedChat } = ChatState();
  const messageEndRef = useRef();

  useEffect(() => {
    const scrollToBottom = () => messageEndRef.current?.scrollIntoView();
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      <>
        {messages.map((m, index) => (
          <div key={m._id}>
            {selectedChat.isGroupChat &&
            !isUserMessage(user, m) &&
            isSenderFirstMessage(m, messages, index) ? (
              <p className="name">{m.sender.name}</p>
            ) : null}
            <div
              className={`message-item ${isUserMessage(user, m) ? "mine" : ""}`}
            >
              <div className="avatar-wrapper">
                {!isUserMessage(user, m) &&
                isSenderLastMessage(m, messages, index) ? (
                  <img
                    className="avatar"
                    src={m.sender.pic}
                    alt={m.sender.name}
                  />
                ) : null}
              </div>
              <p className="message">{m.content}</p>
            </div>
          </div>
        ))}
      </>
      <div ref={messageEndRef} />
    </div>
  );
}
