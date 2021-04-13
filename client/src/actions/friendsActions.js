import { GET_FOLLOWERS, GET_FOLLOWING } from "../actions/types";

export const getFollowers = () => (dispatch, getState) => {
  const followers = [...getState().auth.user.followers];
  console.log("followers: ", followers);
};

export const getFollowing = () => (dispatch, getState) => {
  const following = [...getState().auth.user.following];
  console.log("following: ", following);
};
