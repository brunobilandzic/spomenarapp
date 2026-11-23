import {
  GET_FOLLOWERS,
  GET_FOLLOWING,
  CLEAR_FOLLOW,
  GET_EXPLORE,
  CLEAR_EXPLORE,
} from "../actions/types";

const initialState = {
  followers: [],
  following: [],
  explore: [],
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
    case GET_EXPLORE:
      return {
        ...state,
        explore: [...action.payload.users],
      };
    case CLEAR_FOLLOW:
      return {
        ...state,
        following: [],
        followers: [],
      };
    case CLEAR_EXPLORE:
      return {
        ...state,
        explore: [],
      };
    default:
      return {
        ...state,
      };
  }
}
