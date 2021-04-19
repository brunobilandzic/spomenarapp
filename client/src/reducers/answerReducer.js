import {
  ADD_QUESTIONS,
  ADD_ANSWER,
  CLEAR_ANSWERS,
  FORBID_ANSWERING,
  ALLOW_ANSWERING,
} from "../actions/types";

const initialState = {
  questions: [],
  isAnswered: false,
};

export default function answerReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_QUESTIONS:
      return {
        ...state,
        questions: [...action.payload],
      };
    case ADD_ANSWER:
      // payload is {qid, answer}
      let index = state.questions.findIndex(
        (q) => q._id === action.payload.qId
      );
      let questionToUpdate = state.questions[index];
      questionToUpdate.answer = action.payload.answer;

      return {
        ...state,
        questions: [
          ...state.questions.slice(0, index),
          questionToUpdate,
          ...state.questions.slice(index + 1),
        ],
      };
    case CLEAR_ANSWERS:
      return {
        ...state,
        questions: [],
      };
    case FORBID_ANSWERING:
      return {
        ...state,
        isAnswered: true,
      };
    case ALLOW_ANSWERING:
      return {
        ...state,
        isAnswered: true,
      };
    default:
      return state;
  }
}
