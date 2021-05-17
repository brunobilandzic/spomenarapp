import {
  GRANT_PASS_RESET,
  DENY_PASS_RESET,
  PASS_RESET_SUCCESS,
  PASS_RESET_FAILURE,
  EMAIL_SENT_SUCCESS,
  LINK_VERIFICATION_SUCCESS,
  EMAIL_SENT_FAILURE,
  LINK_VERIFICATION_FAILURE,
  UPDATE_HASH,
  GRANT_PROFILE_DELETION,
  DENY_PROFILE_DELETION,
  PROFILE_DELETION_SUCCESS,
} from "../actions/types";

const initialState = {
  passResetAuth: false,
  passResetSuccess: false,
  hash: null,
  passwordForgot: {
    emailSent: false,
    linkVerified: false,
    username: "",
    email: "",
  },
  grantProfileDeletion: false,
  profileDeleted: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GRANT_PASS_RESET:
      return {
        ...state,
        passResetAuth: true,
        hash: action.payload,
      };
    case DENY_PASS_RESET:
    case PASS_RESET_FAILURE:
      return {
        ...state,
        hash: null,
        passResetAuth: false,
        passResetSuccess: false,
      };
    case PASS_RESET_SUCCESS:
      return {
        ...state,
        passResetSuccess: true,
        passResetAuth: false,
        hash: null,
      };
    case EMAIL_SENT_SUCCESS:
      return {
        ...state,
        passwordForgot: {
          ...state.passwordForgot,
          emailSent: true,
          ...action.payload,
        },
      };
    case LINK_VERIFICATION_SUCCESS:
      return {
        ...state,
        passResetAuth: true,
        passwordForgot: {
          ...state.passwordForgot,
          linkVerified: true,
        },
      };
    case EMAIL_SENT_FAILURE:
    case LINK_VERIFICATION_FAILURE:
      return {
        ...state,
        passwordForgot: {
          ...initialState.passwordForgot,
        },
      };
    case UPDATE_HASH: {
      return {
        ...state,
        hash: action.payload,
      };
    }
    case GRANT_PROFILE_DELETION:
      return {
        ...state,
        grantProfileDeletion: true,
      };
    case DENY_PROFILE_DELETION:
      return {
        ...state,
        grantProfileDeletion: false,
      };
    case PROFILE_DELETION_SUCCESS:
      return {
        ...state,
        profileDeleted: true,
      };
    default:
      return {
        ...state,
      };
  }
}
