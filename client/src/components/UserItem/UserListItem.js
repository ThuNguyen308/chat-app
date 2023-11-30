import React from "react";

export default function UserListItem({ user, handleClick }) {
  return (
    <div className="user-list-item" onClick={handleClick}>
      <img src={user.pic} alt={user.name} />
      <div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
