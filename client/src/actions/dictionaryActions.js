import { LOAD_DICTIONARIES, CLEAR_DICTIONARIES } from "../actions/types";
import axios from "axios";
import { returnErrors } from "./errorActions";
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

export const loadUserDictionaries = (userId) => (dispatch) => {
  clearDictionaries();
  axios
    .get("/api/dicts/u/" + userId)
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
export const clearDictionaries = () => (dispatch) => {
  dispatch({
    type: CLEAR_DICTIONARIES,
  });
};
