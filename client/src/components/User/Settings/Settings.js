import React from "react";
import PasswordChange from "./PasswordChange";
import { Link } from "react-router-dom";
export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <link to="/changepassword">Change Password</link>
    </div>
  );
}
