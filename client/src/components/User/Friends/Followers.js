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
          <div className="follow-list-item" key={uuid()}>
            <Link
              to={"/" + f.username}
              className="app-navigation-link d-flex align-items-center"
            >
              <img
                src={f.imageUrl ? f.imageUrl : INCOGNITO_PROFILE_IMAGE}
                className="round-box-com round-box mr-2"
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
