import React, { useEffect } from "react";
import {
  getFollowers,
  getFollowing,
  clearFollow,
} from "../../../actions/friendsActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import Followers from "./Followers";
import Following from "./Following";

function Friends(props) {
  useEffect(() => {
    console.log("Reloaded");
    if (!props.user) return;
    console.log("Updating");
    props.getFollowers();
    props.getFollowing();
  }, [props.user]);
  return (
    <div className="follow-container">
      <div className="follow-box">
        <Followers followers={props.followers} />
      </div>
      <div className="follow-box">
        <Following following={props.following} />
      </div>
    </div>
  );
}

Following.propTypes = {
  user: propTypes.object,
  getFollowing: propTypes.func,
  getFollowers: propTypes.func,
  clearFollow: propTypes.func,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  following: state.friends.following,
  followers: state.friends.followers,
});

export default connect(mapStateToProps, {
  getFollowing,
  getFollowers,
  clearFollow,
})(Friends);
