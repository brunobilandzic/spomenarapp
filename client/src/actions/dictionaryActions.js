import {
  LOAD_DICTIONARIES,
  CLEAR_DICTIONARIES,
  DELETE_DICTIONARY,
  LOAD_ANSWERS_COUNTS,
  CLEAR_ANSWERS_COUNT,
} from "../actions/types";
import axios from "axios";
import { returnErrors } from "./errorActions";
import { tokenConfig } from "./authActions";
export const loadAllDictionaries = () => (dispatch) => {
  clearDictionaries();
  axios
    .get("/api/dicts")
    .then((res) => {
      dispatch({
        type: LOAD_DICTIONARIES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: CLEAR_DICTIONARIES,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DICTIONARY_LOAD_FAILURE"
        )
      );
    });
};

export const loadUserDictionaries = (userId = null) => (dispatch, getState) => {
  clearDictionaries();
  console.log("getting dicts for " + userId);
  const path = userId ? userId : getState().auth.user.id;
  axios
    .get("/api/dicts/u/" + path)
    .then((res) => {
      dispatch({
        type: LOAD_DICTIONARIES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: CLEAR_DICTIONARIES,
      });
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DICTIONARY_LOAD_FAILURE"
        )
      );
    });
};
export const deleteDictionary = (dictId) => (dispatch, getState) => {
  axios
    .delete("/api/dicts/" + dictId, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_DICTIONARY,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DICTIONARY_DELETE_FAILURE"
        )
      );
    });
};

export const fetchAnswersCount = (dictionaries) => (dispatch) => {
  const body = { dictionaries };
  console.log(body);
  axios
    .post("/api/answers/dict/count", body, null)
    .then((res) => {
      let answerCounts = {};
      res.data.forEach((answerCount) => {
        answerCounts[answerCount.dictionary] = answerCount.count;
      });
      dispatch({
        type: LOAD_ANSWERS_COUNTS,
        payload: { ...answerCounts },
      });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "DICTIONARY_LOAD_FAILURE"
        )
      );
    });
};
export const clearAnswersCount = () => (dispatch) => {
  dispatch({
    type: CLEAR_ANSWERS_COUNT,
  });
};
export const clearDictionaries = () => (dispatch) => {
  dispatch({
    type: CLEAR_DICTIONARIES,
  });
};
