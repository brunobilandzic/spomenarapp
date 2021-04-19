import React from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <Link className="app-navigation-link" to="/friends">
          Friends
        </Link>
      </div>
      <div>
        <Link className="app-navigation-link" to="/settings">
          Settings
        </Link>
      </div>
      <div>
        <Link className="app-navigation-link" to="/explore">
          Explore
        </Link>
      </div>
    </div>
  );
}
