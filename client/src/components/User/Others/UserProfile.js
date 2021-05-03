import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import propTypes from "prop-types";
import axios from "axios";
import {
  getFollowers,
  getFollowing,
  clearFollow,
} from "../../../actions/friendsActions";

import { loadUserDictionaries } from "../../../actions/dictionaryActions";
import Following from "../Friends/Following";
import Followers from "../Friends/Followers";
import DictionariesWrap from "../../Dictionaries/DictionariesWrap";
import FollowButton from "../../Buttons/FollowButton";
function UserProfile(props) {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    console.log("getting user");
    let isMounted = true;
    axios
      .get("/api/users/u/" + username)
      .then((res) => {
        if (isMounted) {
          setUserProfile({ ...res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [username]);
  useEffect(() => {
    props.getFollowers(username);
    props.getFollowing(username);
  }, [username]);
  useEffect(() => {
    if (userProfile) props.loadUserDictionaries(userProfile._id);
  }, [userProfile]);
  return (
    <div>
      <div className="user-profile-head">
        <img
          className="user-profile-img round-box round-box-lg user-profile-img-lg"
          src={
            userProfile
              ? userProfile.imageUrl
                ? userProfile.imageUrl
                : "https://taggmagazine.com/wp-content/uploads/2018/06/shadow-profile.jpg"
              : null
          }
        />
        <h4>@{username}</h4>
      </div>
      <FollowButton followId={userProfile && userProfile._id} />
      <div>
        <div>
          <Followers followers={props.followers} />
        </div>
        <div>
          <Following following={props.following} />
        </div>
      </div>
      <div>
        <h4 className="user-dicts-hedaer">Dictionaries</h4>
        {userProfile && (
          <DictionariesWrap author={true} userId={userProfile._id} />
        )}
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  getFollowers: propTypes.func.isRequired,
  getFollowing: propTypes.func.isRequired,
  loadUserDictionaries: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  following: state.friends.following,
  followers: state.friends.followers,
});

export default connect(mapStateToProps, {
  getFollowers,
  getFollowing,
  loadUserDictionaries,
})(UserProfile);
