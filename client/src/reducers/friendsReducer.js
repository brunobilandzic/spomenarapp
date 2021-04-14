import { GET_FOLLOWERS, GET_FOLLOWING, CLEAR_FOLLOW } from "../actions/types";

const initialState = {
  followers: [],
  following: [],
};

export default function friendsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FOLLOWERS:
      return {
        ...state,
        followers: [...action.payload.users],
      };
    case GET_FOLLOWING:
      return {
        ...state,
        following: [...action.payload.users],
      };
    case CLEAR_FOLLOW:
      return {
        ...state,
        following: [],
        followers: [],
      };
    default:
      return {
        ...state,
      };
  }
}
