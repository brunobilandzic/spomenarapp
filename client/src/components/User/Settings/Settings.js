import React from "react";
import { Link } from "react-router-dom";
export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <Link className="app-navigation-link" to="/changepassword">
        Change Password
      </Link>
    </div>
  );
}
