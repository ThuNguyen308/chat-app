import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import react from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
