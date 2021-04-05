import axios from "axios";
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  AUTH_ERROR,
} from "../actions/types";

export const register = (username, password) => (dispatch) => {
  const config = {
    headers: {
      "Content-type": "appliaction/json",
    },
  };

  const body = JSON.stringify({ username, password });

  axios
    .post("/api/users", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};
