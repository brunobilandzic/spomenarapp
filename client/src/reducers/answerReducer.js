import {
  ADD_QUESTIONS,
  ADD_ANSWER,
  CLEAR_ANSWERS,
  FORBID_ANSWERING,
  ALLOW_ANSWERING,
  SET_ANSWER_COUNT,
  CLEAR_ANSWER_COUNT,
} from "../actions/types";

const initialState = {
  questions: [],
  isAnswered: false,
  answerCount: 0,
};

export default function answerReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_QUESTIONS:
      return {
        ...state,
        questions: [...action.payload],
      };
    case SET_ANSWER_COUNT:
      return {
        ...state,
        answerCount: action.payload,
      };
    case CLEAR_ANSWER_COUNT:
      return {
        ...state,
        answerCount: 0,
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
        isAnswered: false,
      };
    default:
      return { ...state };
  }
}
