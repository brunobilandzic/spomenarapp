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
import { INCOGNITO_PROFILE_IMAGE } from "../../../style/images";
import { loadUserDictionaries } from "../../../actions/dictionaryActions";
import Following from "../Friends/Following";
import Followers from "../Friends/Followers";
import DictionariesWrap from "../../Dictionaries/DictionariesWrap";
import FollowButton from "../../Buttons/FollowButton";
import ProfileImagePreview from "../../Modals/ProfileImagePreview";
import { ButtonGroup, Button } from "reactstrap";

const DICTIONARIES = "DICTIONARIES";
const FRIENDS = "FRIENDS";

function UserProfile(props) {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [view, setView] = useState(DICTIONARIES);

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
      <div className="user-profile-head d-flex">
        {userProfile && (
          <ProfileImagePreview other={true} imageUrl={userProfile.imageUrl} />
        )}
        <h4 className="user-profile-username">
          <b>@{username}</b>
        </h4>

        <FollowButton followId={userProfile && userProfile._id} />
      </div>
      <ButtonGroup className="user-profile-nav">
        <Button
          color="light"
          onClick={() => setView(DICTIONARIES)}
          active={view == DICTIONARIES}
          className="user-profile-nav-item btn-group-btn"
        >
          Dictionaries
        </Button>
        <Button
          color="light"
          onClick={() => setView(FRIENDS)}
          active={view == FRIENDS}
          className="user-profile-nav-item btn-group-btn"
        >
          Friends
        </Button>
      </ButtonGroup>
      {view == DICTIONARIES && (
        <div>
          {userProfile && (
            <DictionariesWrap author={true} userId={userProfile._id} />
          )}
        </div>
      )}
      {view == FRIENDS && (
        <div className="follow-container">
          <div className="follow-box">
            <Followers followers={props.followers} />
          </div>
          <div className="follow-box">
            <Following following={props.following} />
          </div>
        </div>
      )}
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
