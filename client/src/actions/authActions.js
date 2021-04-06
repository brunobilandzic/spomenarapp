import axios from "axios";
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  AUTH_ERROR,
  LOGOUT_SUCCESS,
  LOAD_USER,
} from "../actions/types";
import { returnErrors } from "../actions/errorActions";

export const loadUser = () => (dispatch, getState) => {
  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: LOAD_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
      });
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
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

export const login = ({ user, password }) => (dispatch) => {
  // user can mean email or username
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const body = { user, password };
  axios
    .post("/api/auth", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
    });
};

export const logout = () => (dispatch) => {
  console.log("logout");
  dispatch({
    type: LOGOUT_SUCCESS,
  });
};

export const tokenConfig = (getState) => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
