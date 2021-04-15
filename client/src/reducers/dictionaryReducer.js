import { LOAD_DICTIONARIES, CLEAR_DICTIONARIES } from "../actions/types";

const initialState = {
  dictionaries: [],
};

export default function dictionaryReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DICTIONARIES:
      return {
        ...state,
        dictionaries: [...action.payload],
      };
    case CLEAR_DICTIONARIES:
      return {
        ...state,
        dictionaries: [],
      };
    default:
      return {
        ...state,
      };
  }
}
