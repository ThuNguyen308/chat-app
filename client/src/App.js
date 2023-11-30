import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/Home";
import ChatPage from "./pages/Chat";
import ResetPasswordPage from "./pages/ResetPassword";
import ChatProvider from "./context/ChatProvider";
import "./App.css";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/chats" element={<ChatPage />} />
            </Route>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
