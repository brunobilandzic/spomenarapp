import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { getUsers } from "../../../actions/friendsActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import FollowButton from "../../Buttons/FollowButton";
import { INCOGNITO_PROFILE_IMAGE } from "../../../style/images";
function ExploreUsers(props) {
  useEffect(() => {
    props.getUsers();
  }, []);
  return (
    <div>
      <div className="follow-header">Explore</div>
      <div className="follow-list">
        {props.explore.map((u) => (
          <div className="follow-list-item" key={uuid()}>
            <Link
              to={"/" + u.username}
              className="app-navigation-link d-flex align-items-center"
            >
              <img
                src={u.imageUrl ? u.imageUrl : INCOGNITO_PROFILE_IMAGE}
                className="round-box-com round-box mr-2"
              />
              {u.username}
            </Link>
            &nbsp;
            <FollowButton followId={u._id} />
          </div>
        ))}
      </div>
    </div>
  );
}

ExploreUsers.propTypes = {
  getUsers: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  explore: state.friends.explore,
});

export default connect(mapStateToProps, { getUsers })(ExploreUsers);
