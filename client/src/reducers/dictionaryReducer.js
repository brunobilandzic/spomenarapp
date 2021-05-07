import {
  LOAD_DICTIONARIES,
  CLEAR_DICTIONARIES,
  DELETE_DICTIONARY,
  LOAD_ANSWERS_COUNTS,
  CLEAR_ANSWERS_COUNT,
} from "../actions/types";

const initialState = {
  dictionaries: [],
  answersCounts: [],
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
    case DELETE_DICTIONARY:
      const dictId = action.payload.dictId;
      return {
        ...state,
        dictionaries: [state.dictionaries.filter((d) => d != dictId)],
      };
    case LOAD_ANSWERS_COUNTS:
      return {
        ...state,
        answersCounts: { ...action.payload },
      };
    case CLEAR_ANSWERS_COUNT:
      return {
        ...state,
        answersCounts: [],
      };
    default:
      return {
        ...state,
      };
  }
}
