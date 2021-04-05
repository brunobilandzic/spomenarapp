import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  AUTH_ERROR,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: null,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...action.payload,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
  }
}
