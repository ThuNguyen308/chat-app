import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../../services/customize-axios";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const postImage = async (pic) => {
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
        setPic(res.url);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      console.log(name, email, password, confirmPassword);
      toast.error("Please fill all the Fields.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const data = await axios.post("/user/register", {
        name,
        email,
        password,
        pic,
      });

      if (data.success) {
        toast.success("Register successful.");
      } else {
        toast.success(data.message);
      }

      setName();
      setEmail();
      setPassword();
      setConfirmPassword();
      setPic();
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
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
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

      <div className="form-group">
        <label htmlFor="password-confirm">Confirm Password</label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="password-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="btn input-group-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
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
          <i
            className="fa fa-circle-o-notch fa-spin"
            style={{ fontSize: 24 }}
          ></i>
        )}
        Sign up
      </button>
    </div>
  );
}
