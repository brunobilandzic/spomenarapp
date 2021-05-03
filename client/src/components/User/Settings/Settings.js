import React from "react";
import { Link } from "react-router-dom";
export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <Link className="app-navigation-link" to="/changepassword">
          Change Password
        </Link>
      </div>
      <div>
        <Link className="app-navigation-link" to="/changeprofileimage">
          Change Profile Image
        </Link>
      </div>
    </div>
  );
}
