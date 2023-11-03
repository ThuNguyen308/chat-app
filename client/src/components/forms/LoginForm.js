import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.error("Please fill all field.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API + "/api/user/login",
        {
          email,
          password,
        }
      );
      if (data.success) {
        toast.success("Login successful.");
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.token));
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn input-group-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <Link
          style={{ fontSize: "1.4rem", float: "right", fontStyle: "italic" }}
          to="/reset-password"
        >
          Forgot Password
        </Link>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading && (
          <i
            className="fa fa-circle-o-notch fa-spin"
            style={{ fontSize: 24 }}
          ></i>
        )}
        Login
      </button>
    </div>
  );
}
