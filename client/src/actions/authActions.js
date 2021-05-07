import axios from "axios";
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  AUTH_ERROR,
  LOGOUT_SUCCESS,
  LOAD_USER,
  GRANT_PASS_RESET,
  DENY_PASS_RESET,
  PASS_RESET_SUCCESS,
  PASS_RESET_FAILURE,
  EMAIL_SENT_SUCCESS,
  EMAIL_SENT_FAILURE,
  LINK_VERIFICATION_SUCCESS,
  LINK_VERIFICATION_FAILURE,
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_FAILURE,
  IMAGE_CHANGE_SUCCESS,
  IMAGE_CHANGE_FAILURE,
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
      dispatch(
        returnErrors(err.response.data, err.response.status, "AUTH_ERROR")
      );
    });
};
export const register = ({
  username,
  password,
  name,
  email,
  passwordRepeat,
  image,
}) => (dispatch) => {
  if (password != passwordRepeat) {
    return returnErrors({
      msg: "Passwords have to match",
      status: -1,
    });
  }
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };

  const body = { username, password, name, email };
  const formData = new FormData();
  Object.keys(body).forEach((key) => formData.append(key, body[key]));
  formData.append("image", image);
  axios
    .post("/api/users", formData, config)
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

export const verifyEmail = (username, userId) => (dispatch) => {
  axios
    .get(`/api/users/verify/${username}/${userId}`)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: EMAIL_VERIFICATION_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: EMAIL_VERIFICATION_FAILURE,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "EMAIL_VERIFICATION_FAILURE"
        )
      );
    });
};

export const logout = () => (dispatch) => {
  console.log("logout");
  dispatch({
    type: LOGOUT_SUCCESS,
  });
};

export const passResetAuthRequest = (password) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const user = getState().auth.user ? getState().auth.user.username : null;
  const body = { user, password };
  axios
    .post("/api/auth", body, config)
    .then((res) => {
      dispatch({
        type: GRANT_PASS_RESET,
      });
    })
    .catch((err) => {
      dispatch({
        type: DENY_PASS_RESET,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "PASS_RESET_AUTH_FAILURE"
        )
      );
    });
};
export const forgotPasswordRequest = (userInfo) => (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const body = { userInfo };
  axios
    .post("/api/auth/pwd", body, config)
    .then((res) => {
      dispatch({
        type: EMAIL_SENT_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: EMAIL_SENT_FAILURE,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "FORGOT_PASSWORD_EMAIL_FAILURE"
        )
      );
    });
};
export const checkEmailLink = (username, hash) => (dispatch) => {
  axios
    .get(`/api/auth/pwd/${username}/${hash}`)
    .then((res) => {
      dispatch({
        type: LINK_VERIFICATION_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: LINK_VERIFICATION_FAILURE,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "FORGOT_PASSWORD_LINK_FAILURE"
        )
      );
    });
};
export const submitNewPassword = (newPassword) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const username = getState().auth.user ? getState().auth.user.username : null;
  const body = { username, newPassword };
  axios
    .post("/api/auth/pwd/newpwd", body, config)
    .then((res) => {
      dispatch({
        type: PASS_RESET_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PASS_RESET_FAILURE,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "PASS_RESET_FAILURE"
        )
      );
    });
};

export const changeProfileImage = (imageObject) => (dispatch, getState) => {
  const formData = new FormData();
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  const token = getState().auth.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  formData.append("newImage", imageObject);
  axios
    .patch("/api/users/profileimage", formData, config)
    .then((response) => {
      dispatch({
        type: IMAGE_CHANGE_SUCCESS,
        payload: response.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: IMAGE_CHANGE_FAILURE,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "IMAGE_CHANGE_FAILURE"
        )
      );
    });
};

export const deleteProfileImage = () => (dispatch, getState) => {
  const config = {
    headers: {},
  };
  const token = getState().auth.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }
  console.log(config);
  axios
    .delete("/api/users/profileimage", config)
    .then((response) => {
      dispatch({
        type: IMAGE_CHANGE_SUCCESS,
        payload: response.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: IMAGE_CHANGE_FAILURE,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "IMAGE_CHANGE_FAILURE"
        )
      );
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
