import {
  GRANT_PASS_RESET,
  DENY_PASS_RESET,
  PASS_RESET_SUCCESS,
  PASS_RESET_FAILURE,
} from "../actions/types";

const initialState = {
  passResetAuth: false,
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
    case PASS_RESET_SUCCESS:
      return {
        ...state,
        passResetAuth: false,
      };
    default:
      return {
        ...state,
      };
  }
}
