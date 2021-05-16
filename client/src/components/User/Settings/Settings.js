import React from "react";
import { Link } from "react-router-dom";
export default function Settings() {
  return (
    <div>
      <div className="profile-options settings-options">
        <Link className="app-navigation-link option" to="/changepassword">
          <div className="option-icon">
            <i class="fas fa-key"></i>
          </div>
          <div className="option-text">Change Password</div>
        </Link>
        <Link className="app-navigation-link option" to="/changeprofileimage">
          <div className="option-icon">
            <i class="fas fa-camera-retro"></i>
          </div>
          <div className="option-text">Change Profile Image</div>
        </Link>
      </div>
    </div>
  );
}
