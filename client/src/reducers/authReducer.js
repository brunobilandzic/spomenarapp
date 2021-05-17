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
  IMAGE_CHANGE_SUCCESS,
  PROFILE_DELETION_SUCCESS,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: null,
  registerSuccess: false,
};
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER:
      return {
        ...state,
        user: { ...action.payload },
        isAuthenticated: true,
      };
    case LOGIN_SUCCESS:
    case PASS_RESET_SUCCESS:
    case LINK_VERIFICATION_SUCCESS:
    case EMAIL_VERIFICATION_SUCCESS:
    case IMAGE_CHANGE_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerSuccess: true,
        user: { ...action.payload },
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
    case EMAIL_VERIFICATION_FAILURE:
    case PROFILE_DELETION_SUCCESS:
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
