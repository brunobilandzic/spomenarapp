import React, { useEffect } from "react";
import { getFollowers, getFollowing } from "../../../actions/friendsActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import Followers from "./Followers";
import Following from "./Following";

function Friends(props) {
  useEffect(() => {
    if (!props.user) return;
    props.getFollowers();
    props.getFollowing();
  }, [props.user]);
  return (
    <div>
      <div>
        <Followers followers={props.followers} />
      </div>
      <div>
        <Following following={props.following} />
      </div>
    </div>
  );
}

Following.propTypes = {
  user: propTypes.object,
  getFollowing: propTypes.func,
  getFollowers: propTypes.func,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  following: state.friends.following,
  followers: state.friends.followers,
});

export default connect(mapStateToProps, { getFollowing, getFollowers })(
  Friends
);
