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
export const clearAnswers = () => (dispatch) => {
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

export const postAnswers = (dictId) => (dispatch, getState) => {
  const questions = getState().answering.questions;
  const author = getState().auth.user.id;
  const author_username = getState().auth.user.username;
  const answers = questions.map((q) => ({
    question: q._id,
    value: q.answer,
  }));
  axios
    .post("/api/answers/dict/" + dictId, {
      dictionary: dictId,
      author,
      author_username,
      answers,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
};
