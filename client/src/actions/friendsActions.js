import {
  GET_FOLLOWERS,
  GET_FOLLOWING,
  CLEAR_FOLLOW,
  CLEAR_EXPLORE,
  GET_EXPLORE,
  FETCH_IMAGES,
  CLEAR_IMAGES,
  FETCH_IMAGES_FAILURE,
} from "../actions/types";
import axios from "axios";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

export const getFollowers = (username) => (dispatch) => {
  axios
    .get("/api/users/f/followers/" + username)
    .then((res) => {
      dispatch({
        type: GET_FOLLOWERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "FETCH_FOLLOW_ERR")
      );
      dispatch({
        type: CLEAR_FOLLOW,
      });
    });
};

export const getFollowing = (username) => (dispatch) => {
  axios
    .get("/api/users/f/following/" + username)
    .then((res) => {
      dispatch({
        type: GET_FOLLOWING,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "FETCH_FOLLOW_ERR")
      );
      dispatch({
        type: CLEAR_FOLLOW,
      });
    });
};

export const getUsers = () => (dispatch, getState) => {
  axios
    .get("/api/users", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_EXPLORE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "EXPLORE_ERROR")
      );
      dispatch({
        type: CLEAR_EXPLORE,
      });
    });
};
export const fetchImagesByQuestion = (questionId) => (dispatch) => {
  axios
    .get("/api/users/images/question/" + questionId)
    .then((response) => {
      dispatch({
        type: FETCH_IMAGES,
        payload: response.data.usernameImages,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "FETCH_IMAGES_FAILURE"
        )
      );
      dispatch({
        type: FETCH_IMAGES_FAILURE,
      });
    });
};
export const follow = (followId) => (dispatch, getState) => {
  const body = { followId };
  axios
    .post("/api/users/follow", body, tokenConfig(getState))
    .then((res) => {
      getFollowers(res.data.followUsername);
      getFollowing(res.data.followUsername);
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "FOLLOW_ERR")
      );
    });
};

export const unfollow = (followId) => (dispatch, getState) => {
  const body = { followId };
  axios
    .post("/api/users/unfollow", body, tokenConfig(getState))
    .then((res) => {
      getFollowers(res.data.followUsername);
      getFollowing(res.data.followUsername);
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "FOLLOW_ERR")
      );
    });
};

export const clearFollow = () => (dispatch) => {
  dispatch({ type: CLEAR_FOLLOW });
};
