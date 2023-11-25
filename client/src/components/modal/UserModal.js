import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function UserModal({ onClose, user }) {
  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-wrapper">
        <div className="header">
          <h2>Infomation</h2>
          <span className="close-icon" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>
        <div className="content">
          <h3 className="name">{user.name}</h3>
          <img src={user.pic} alt={user.name} className="avatar" />
          <p className="email">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
