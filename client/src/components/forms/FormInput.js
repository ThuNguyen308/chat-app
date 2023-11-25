import React from 'react'

export default function FormInput() {
  return (
    <div className="form-group">
      <label htmlFor="password-confirm">{label}</label>
      <div className="input-group">
        <input
            name={name}
          type={isShow ? "text" : "password"}
          value={confirmPassword}
          onChange={onChange}
        />
        <button
          className="btn input-group-btn"
          onClick={() => setShowConfirmPassword(!isShow)}
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
