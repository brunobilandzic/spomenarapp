import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import answerReducer from "./answerReducer";
import authReducer from "./authReducer";
// root reducer
// imported in store.js
export default combineReducers({
  error: errorReducer,
  answering: answerReducer,
  auth: authReducer,
  //xyz: xyzReducer
});
