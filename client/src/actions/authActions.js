import axios from "axios";
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  AUTH_ERROR,
} from "../actions/types";
import { returnErrors } from "../actions/errorActions";

export const register = ({
  username,
  password,
  name,
  email,
  passwordRepeat,
}) => (dispatch) => {
  if (password != passwordRepeat) {
    return returnErrors({
      msg: "Passwords have to match",
      status: -1,
    });
  }
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const body = JSON.stringify({ username, password, name, email });
  axios
    .post("/api/users", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};
