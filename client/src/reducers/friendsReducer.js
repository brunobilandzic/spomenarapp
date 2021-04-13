import { GET_FOLLOWERS, GET_FOLLOWING } from "../actions/types";

const initialState = {
  followers: [],
  following: [],
};

export default function friendsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FOLLOWERS:
      return {
        ...state,
        followers: [...action.payload],
      };
    case GET_FOLLOWING:
      return {
        ...state,
        following: [...action.payload],
      };
    default:
      return {
        ...state,
      };
  }
}
