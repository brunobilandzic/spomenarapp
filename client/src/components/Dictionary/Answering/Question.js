import React from "react";
import { v4 as uuid } from "uuid";
import {
  MULTIPLE_CHOICE,
  OPEN,
  APPROVAL,
} from "../../CreateDictionary/AddQuestion/QuestionTypes";
import { addAnswer } from "../../../actions/answerActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
function Question(props) {
  const { question, type, choices, _id, answer } = props;

  const openAnswer = (
    <input
      type="text"
      autoComplete="off"
      name={_id}
      onChange={(e) => {
        props.addAnswer(_id, e.target.value);
      }}
    />
  );
  const multipleChoiceAnswer = (
    <div>
      {choices.map((c) => (
        <div key={uuid()}>
          <input
            onChange={(e) => props.addAnswer(_id, e.target.value)}
            type="radio"
            checked={c.letter == answer}
            name={_id}
            value={c.letter}
          />
          <label htmlFor={c.letter}>{c.choice}</label>
        </div>
      ))}
    </div>
  );
  const approvalAnswer = (
    <div onChange={(e) => props.addAnswer(_id, e.target.value)}>
      <div>
        <input type="radio" name={_id} value={"YES"} />
        <label htmlFor={"YES"}>YES</label>
      </div>
      <div>
        <input type="radio" name={_id} value={"NO"} />
        <label htmlFor={"NO"}>NO</label>
      </div>
      <div>
        <input type="radio" name={_id} value={"I DONT KNOW"} />
        <label htmlFor={"iDontKnow"}>I DONT KNOW</label>
      </div>
    </div>
  );
  return (
    <div>
      {question}, {type}
      <br />
      {type == MULTIPLE_CHOICE && multipleChoiceAnswer}
      {type == OPEN && openAnswer}
      {type == APPROVAL && approvalAnswer}
    </div>
  );
}

Question.propTypes = {
  addAnswer: propTypes.func.isRequired,
};

export default connect(null, { addAnswer })(Question);
