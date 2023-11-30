import axios from "../../services/customize-axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { ChatState } from "../../context/ChatProvider";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleValidate = (name, value) => {
    switch (name) {
      case "email":
        if (!value) {
          return "Email is Required";
        } else if (
          !value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        ) {
          return "Email is invalid";
        } else {
          return "";
        }
      case "password":
        if (!value) {
          return "Password is Required";
        } else {
          return "";
        }
      default: {
        return "";
      }
    }
  };

  const handleInput = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({
      ...errors,
      [e.target.name]: handleValidate(e.target.name, e.target.value),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    let validationErrors = {};
    Object.keys(fields).forEach((name) => {
      const error = handleValidate(name, fields[name]);
      if (error && error.length > 0) {
        validationErrors[name] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const data = await axios.post("/user/login", {
        email: fields.email,
        password: fields.password,
      });
      if (data.success) {
        toast.success("Login successful.");
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.accessToken));
        setUser(data.user);
        navigate("/chats");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="form-inner">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={handleInput}
        />
        <span className="error-message">{errors.email}</span>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={fields.password}
            onChange={handleInput}
          />
          <button
            className="btn input-group-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <span className="error-message">{errors.password}</span>
      </div>

      <div className="text-right">
        <Link to="/reset-password">Forgot Password?</Link>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading && (
          <FontAwesomeIcon className="loading-icon" icon={faCircleNotch} />
        )}
        Login
      </button>
    </div>
  );
}
