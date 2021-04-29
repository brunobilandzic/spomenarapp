import {
  LOAD_DICTIONARIES,
  CLEAR_DICTIONARIES,
  DELETE_DICTIONARY,
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
export const clearDictionaries = () => (dispatch) => {
  dispatch({
    type: CLEAR_DICTIONARIES,
  });
};
