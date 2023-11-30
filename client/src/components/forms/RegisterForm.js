import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../../services/customize-axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function RegisterForm({ toLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });

  const handleValidate = (name, value) => {
    switch (name) {
      case "name":
        if (!value || value.trim() === "") {
          return "Name is required";
        } else {
          return "";
        }
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
        } else if (
          !value.match(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
          )
        ) {
          return "Password should be 8-20 charactors and include at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special charactor!";
        } else {
          return "";
        }
      case "confirmPassword":
        if (!value) {
          return "Confirm Password Required";
        } else if (value !== fields.password) {
          return "New Password and Confirm Password Must be Same";
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

  const postImage = async (pic) => {
    console.log(pic.type);
    if (pic === undefined) {
      toast.error("Please select an Image.");
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      setLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
      data.append("folder", "Cloudinary-React");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const res = await response.json();
        console.log(res);
        setFields({ ...fields, pic: res.url });
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
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
      const data = await axios.post("/user/register", {
        name: fields.name,
        email: fields.email,
        password: fields.password,
        pic: fields.pic,
      });

      if (data.success) {
        setFields({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          pic: "",
        });
        toast.success("Register successful.");
        toLogin();
      } else {
        toast.success(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Register failed.");
    }
    setLoading(false);
  };

  return (
    <div className="form-inner">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={fields.name}
          onChange={handleInput}
        />
        <span className="error-message">{errors.name}</span>
      </div>

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

      <div className="form-group">
        <label htmlFor="password-confirm">Confirm Password</label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={fields.confirmPassword}
            onChange={handleInput}
          />
          <button
            className="btn input-group-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        <span className="error-message">{errors.confirmPassword}</span>
      </div>

      <div className="form-group">
        <label htmlFor="image">Avatar</label>
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={(e) => postImage(e.target.files[0])}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading && (
          <FontAwesomeIcon className="loading-icon" icon={faCircleNotch} />
        )}
        Sign up
      </button>
    </div>
  );
}
