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
    console.log("Loading dictionaries");
    if (userProfile) props.loadUserDictionaries(userProfile._id);
  }, [userProfile]);
  return (
    <div>
      <div>User {username}</div>
      <div>
        <div>
          <Followers followers={props.followers} />
        </div>
        <div>
          <Following following={props.following} />
        </div>
      </div>
      <div>
        <DictionariesWrap />
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
