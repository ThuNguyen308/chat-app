import React, { useEffect, useRef, useState } from "react";
import SearchDrawer from "../SearchDrawer";
import UserModal from "../modal/UserModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChatState } from "../../context/ChatProvider";
import { getSenderName } from "../../helper/ChatLogics";
import logo from "../../assets/images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const { user, notifications, setNotifications, setSelectedChat } =
    ChatState();
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  useEffect(() => {
    let dropDownBtns = document.querySelectorAll(".dropdown-btn");
    let dropDownMenus = document.querySelectorAll(".dropdown-menu");

    dropDownBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        dropDownMenus[index].classList.toggle("active");
      });
    });

    window.addEventListener("click", (e) => {
      if (
        !Array.from(dropDownBtns).includes(e.target.closest(".dropdown-btn"))
      ) {
        dropDownMenus.forEach((menu) => menu.classList.remove("active"));
      }
    });
  }, []);

  const handleCloseSearchDrawer = async () => {
    setIsOpenSearchDrawer(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    toast.success("Logout");
    navigate("/");
  };

  return (
    <>
      <div className="header-container">
        <button
          className="d-flex align-items-center g-1 btn"
          onClick={() => setIsOpenSearchDrawer(true)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search users</span>
        </button>

        <div className="logo">
          <img src={logo} />
          <h3>Let's Talk</h3>
        </div>

        <div className="d-flex g-1 h-100">
          <div className="dropdown">
            <button
              className="d-flex align-items-center g-1 dropdown-btn btn"
              ref={dropdownRef}
            >
              <div className="notification">
                <i className="fa-solid fa-bell"></i>
                <span className="badge">{notifications.length}</span>
              </div>
            </button>
            <ul className="dropdown-menu">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedChat(notification.chat);
                      setNotifications(
                        notifications.filter(
                          (noti) => noti.chat_id === notification.chat._id
                        )
                      );
                    }}
                  >
                    New message from{" "}
                    {notification.chat.isGroupChat
                      ? notification.chat.chatName
                      : getSenderName(user, notification.chat.users)}
                  </li>
                ))
              ) : (
                <li className="dropdown-item">No notifications</li>
              )}
            </ul>
          </div>
          <div className="dropdown">
            <button
              className="d-flex align-items-center g-1 dropdown-btn btn"
              ref={dropdownRef}
            >
              <div className="avatar">
                <img src={user.pic} />
              </div>
              <p>{user.name}</p>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onClick={() => setIsOpenUserModal(true)}
              >
                Your Info
              </li>
              <hr />
              <li className="dropdown-item" onClick={handleLogout}>
                Log out
              </li>
            </ul>
          </div>
        </div>
      </div>

      <SearchDrawer
        isOpen={isOpenSearchDrawer}
        onClose={handleCloseSearchDrawer}
      />

      {isOpenUserModal ? (
        <UserModal onClose={() => setIsOpenUserModal(false)} user={user} />
      ) : null}
    </>
  );
}
