import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  AUTH_ERROR,
  LOGOUT_SUCCESS,
  LOAD_USER,
  PASS_RESET_SUCCESS,
  LINK_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_FAILURE,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: null,
};
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER:
      return {
        ...state,
        user: { ...action.payload },
        isAuthenticated: true,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case PASS_RESET_SUCCESS:
    case LINK_VERIFICATION_SUCCESS:
    case EMAIL_VERIFICATION_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...action.payload,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
    case EMAIL_VERIFICATION_FAILURE:
      localStorage.removeItem("token");
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return { ...state };
  }
}
