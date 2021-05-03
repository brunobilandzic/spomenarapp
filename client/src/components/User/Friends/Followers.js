import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { INCOGNITO_PROFILE_IMAGE } from "../../../style/images";
import FollowButton from "../../Buttons/FollowButton";
export default function Followers(props) {
  return (
    <div>
      <div className="follow-header">Followers</div>
      <div className="follow-list">
        {props.followers.map((f) => (
          <div key={uuid()}>
            <Link to={"/" + f.username} className="app-navigation-link">
              <img
                src={f.imageUrl ? f.imageUrl : INCOGNITO_PROFILE_IMAGE}
                className="round-box-sm round-box"
              />
              {f.username}
            </Link>
            &nbsp;
            <FollowButton followId={f.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
