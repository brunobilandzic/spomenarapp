import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
export default function Followers(props) {
  return (
    <div>
      <div className="follow-header">Followers</div>
      <div className="follow-list">
        {props.followers.map((f) => (
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
