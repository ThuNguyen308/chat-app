import React, { useState } from "react";
import "../styles/pages/HomePage.scss";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function HomePage() {
  const [tabIndex, setTabIndex] = useState(0); //{0: login, 1: sign up}

  return (
    <div className="container-form">
      <div className="form-wrapper">
        <div className="tab-list">
          <button
            className={`tab-item ${tabIndex === 0 ? "active" : null}`}
            onClick={() => setTabIndex(0)}
          >
            Login
          </button>
          <button
            className={`tab-item ${tabIndex === 1 ? "active" : null}`}
            onClick={() => setTabIndex(1)}
          >
            Sign up
          </button>
        </div>
        <div className="tab-content">
          {tabIndex === 0 ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
