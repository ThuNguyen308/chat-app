import axios from "../services/customize-axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/pages/HomePage.scss";
import logo from "../assets/images/logo.png";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (!email) {
      toast.error("Please fill Email field.");
      setLoading(false);
      return;
    }

    try {
      const data = await axios.post("/user/reset-password", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log("loi", e);
    }
    setLoading(false);
  };

  return (
    <div className="container-form">
      <div className="form-wrapper">
        <div className="logo">
          <img src={logo} />
          <h1>Let's Talk</h1>
        </div>
        <div className="form-inner">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!email || loading}
          >
            {loading && (
              <i
                className="fa fa-circle-o-notch fa-spin"
                style={{ fontSize: 24 }}
              ></i>
            )}
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}
