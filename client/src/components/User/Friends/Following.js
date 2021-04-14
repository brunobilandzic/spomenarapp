import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
export default function Following(props) {
  return (
    <div>
      <div className="follow-header">Following</div>
      <div className="follow-list">
        {props.following.map((f) => (
          <div key={uuid()}>
            <Link to={"/users/" + f.username} className="app-navigation-link">
              {f.username}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
