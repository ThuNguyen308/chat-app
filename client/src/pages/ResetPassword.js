import axios from "../services/customize-axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/pages/HomePage.scss";
import logo from "../assets/images/logo.png";
import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidate = (value) => {
    if (!value) {
      return "Email is Required";
    } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return "Email is invalid";
    } else {
      return "";
    }
  };

  const handleInput = (e) => {
    setEmail(e.target.value);
    setError(handleValidate(e.target.value));
  };

  const handleSubmit = async () => {
    setLoading(true);
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

  const backPrevious = () => {
    navigate(-1);
  };

  return (
    <div className="container-form">
      <div className="form-wrapper" style={{ position: "relative" }}>
        <button
          onClick={backPrevious}
          className="btn"
          style={{
            position: "absolute",
            left: "10x",
            top: "10px",
            fontSize: "2rem",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="logo">
          <img src={logo} alt="Let's talk" />
          <h1>Let's Talk</h1>
        </div>
        <div className="form-inner">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInput}
            />
            <span className="error-message">{error}</span>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!email || loading}
          >
            {loading && (
              <FontAwesomeIcon className="loading-icon" icon={faCircleNotch} />
            )}
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}
