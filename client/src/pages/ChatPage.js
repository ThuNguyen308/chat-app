import React, { useState } from "react";
import Header from "../components/layout/Header";
import ChatList from "../components/layout/ChatList";
import ChatBox from "../components/layout/ChatBox";
import "../styles/pages/ChatPage.scss";
import { ChatState } from "../context/ChatProvider";
import SearchDrawer from "../components/SearchDrawer";

export default function ChatPage() {
  const { user } = ChatState();
  const [fetchChatsAgain, setFetchChatsAgain] = useState(false);

  return (
    <>
      {user ? (
        <>
          <div style={{ width: "100%" }}>
            <Header />
            <div className="body-container">
              <ChatList fetchChatsAgain={fetchChatsAgain} />
              <ChatBox
                fetchChatsAgain={fetchChatsAgain}
                setFetchChatsAgain={setFetchChatsAgain}
              />
            </div>
          </div>

          <SearchDrawer />
        </>
      ) : (
        <p>No permission to access this page.</p>
      )}
    </>
  );
}
