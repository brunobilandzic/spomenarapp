import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import answerReducer from "./answerReducer";
// root reducer
// imported in store.js
export default combineReducers({
  error: errorReducer,
  answering: answerReducer,
  //xyz: xyzReducer
});
