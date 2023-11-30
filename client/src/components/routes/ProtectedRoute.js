import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

export default function ProtectedRoute() {
  const { user } = ChatState();
  return !user?._id ? <Navigate to="/" /> : <Outlet />;
}
