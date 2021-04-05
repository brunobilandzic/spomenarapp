import { ADD_QUESTIONS, ADD_ANSWER, CLEAR_ANSWERS } from "./types";
import axios from "axios";

export const addQuestions = (dictId) => (dispatch) => {
  dispatch({
    type: CLEAR_ANSWERS,
  });
  axios
    .get("/api/quests/dict/" + dictId)
    .then((response) => {
      dispatch({
        type: ADD_QUESTIONS,
        payload: response.data.map((q) => ({ ...q, answer: null })),
      });
    })
    .catch((err) => console.log(err));
};
export const cleaeAnswers = () => (dispatch) => {
  dispatch({
    type: CLEAR_ANSWERS,
  });
};
export const addAnswer = (qId, answer) => (dispatch) => {
  dispatch({
    type: ADD_ANSWER,
    payload: { qId, answer },
  });
};

export const postAnswers = (dictId, next) => (dispatch, getState) => {
  const questions = getState().answering.questions;
  const answers = questions.map((q) => ({
    question: q._id,
    value: q.answer,
  }));
  axios
    .post("/api/answers/dict/" + dictId, {
      dictionary: dictId,
      author: "6059f8ec21c57a06b0bb81e1",
      answers,
    })
    .then((res) => {
      next(res);
    })
    .catch((err) => console.log(err));
};