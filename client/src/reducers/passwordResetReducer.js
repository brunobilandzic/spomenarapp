import {
  GRANT_PASS_RESET,
  DENY_PASS_RESET,
  PASS_RESET_SUCCESS,
  PASS_RESET_FAILURE,
  EMAIL_SENT_SUCCESS,
  LINK_VERIFICATION_SUCCESS,
  EMAIL_SENT_FAILURE,
  LINK_VERIFICATION_FAILURE,
} from "../actions/types";

const initialState = {
  passResetAuth: false,
  passResetSuccess: false,
  passwordForgot: {
    emailSent: false,
    linkVerified: false,
    username: "",
    email: "",
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GRANT_PASS_RESET:
      return {
        ...state,
        passResetAuth: true,
      };
    case DENY_PASS_RESET:
    case PASS_RESET_FAILURE:
      return {
        ...state,
        passResetAuth: false,
        passResetSuccess: false,
      };
    case PASS_RESET_SUCCESS:
      return {
        ...state,
        passResetSuccess: true,
        passResetAuth: false,
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
    default:
      return {
        ...state,
      };
  }
}
