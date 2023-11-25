import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChatProvider from "./context/ChatProvider";
import "./App.css";

function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossorigin="anonymous"
      />
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
