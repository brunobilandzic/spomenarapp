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
import { Input, Label } from "reactstrap";
function Question(props) {
  const { question, type, choices, _id, answer } = props;

  const openAnswer = (
    <div className="answer-wrap">
      <Input
        type="text"
        autoComplete="off"
        value={answer}
        name={_id}
        placeholder="Type in your answer"
        onChange={(e) => {
          props.addAnswer(_id, e.target.value);
        }}
      />
    </div>
  );
  const multipleChoiceAnswer = (
    <div className="multiple-choice-answer-wrap multi-radio multiple-choice-wrap answer-wrap">
      {choices.map((c) => (
        <div className="choice-answer-wrap radio-wrap" key={uuid()}>
          <Input
            onChange={(e) => props.addAnswer(_id, e.target.value)}
            type="radio"
            checked={c.letter == answer}
            name={_id}
            value={c.letter}
          />
          <Label htmlFor={c.letter}>{c.choice}</Label>
        </div>
      ))}
    </div>
  );
  const approvalAnswer = (
    <div
      className="approval-answer-wrap multi-radio approval-wrap answer-wrap"
      onChange={(e) => props.addAnswer(_id, e.target.value)}
    >
      <div className="approval-answer-wrap radio-wrap">
        <Input type="radio" name={_id} value={"Yes"} />
        <Label>Yes</Label>
      </div>
      <div className="approval-answer-wrap radio-wrap">
        <Input type="radio" name={_id} value={"No"} />
        <Label>No</Label>
      </div>
      <div className="approval-answer-wrap radio-wrap">
        <Input type="radio" name={_id} value={"I_DONT_KNOW"} />
        <Label>Dont Know</Label>
      </div>
    </div>
  );
  return (
    <div>
      {props.index == props.order && (
        <div className="">
          <div className="question-label-wrap answering">
            <div className="question-count">
              <small>
                {props.order + 1}/{props.length}
              </small>
            </div>
            <div className="question-label answering question-value">
              {question}
            </div>
          </div>
          {type == MULTIPLE_CHOICE && multipleChoiceAnswer}
          {type == OPEN && openAnswer}
          {type == APPROVAL && approvalAnswer}
        </div>
      )}
    </div>
  );
}

Question.propTypes = {
  addAnswer: propTypes.func.isRequired,
};

export default connect(null, { addAnswer })(Question);
