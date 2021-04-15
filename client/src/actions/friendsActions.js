import { GET_FOLLOWERS, GET_FOLLOWING, CLEAR_FOLLOW } from "../actions/types";
import axios from "axios";
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

export const clearFollow = () => (dispatch) => {
  dispatch({ type: CLEAR_FOLLOW });
};
