import React, { useEffect, useRef, useState } from "react";
import SearchDrawer from "../SearchDrawer";
import UserModal from "../modal/UserModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isOpenDropdownMenu, setIsOpenDropdownMenu] = useState(false);

  useEffect(() => {
    const toggleDropdownMenu = (e) => {
      setIsOpenDropdownMenu(
        dropdownRef.current == e.target.closest(".dropdown-btn")
      );
    };
    document.addEventListener("click", toggleDropdownMenu);
    return () => document.removeEventListener("click", toggleDropdownMenu);
  }, []);

  const handleCloseSearchDrawer = async () => {
    setIsOpenSearchDrawer(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout");
    navigate("/");
  };

  return (
    <>
      <div className="header-container">
        <button
          className="d-flex align-items-center g-1"
          onClick={() => setIsOpenSearchDrawer(true)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search users</span>
        </button>

        <h3>Chat app</h3>

        <div className="d-flex g-1 h-100">
          <button>
            <div className="notification">
              <i className="fa-solid fa-bell"></i>
              <span className="badge">1</span>
            </div>
          </button>
          <div className="dropdown">
            <button
              className="d-flex align-items-center g-1 dropdown-btn"
              ref={dropdownRef}
            >
              <div className="avatar">
                <img src={user.pic} />
              </div>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <ul className={`dropdown-menu ${isOpenDropdownMenu && "active"}`}>
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
