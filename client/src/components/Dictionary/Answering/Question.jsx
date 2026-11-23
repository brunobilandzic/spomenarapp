import React from "react";
import {
  MULTIPLE_CHOICE,
  OPEN,
  APPROVAL,
} from "../../CreateDictionary/AddQuestion/QuestionTypes";
import propTypes from "prop-types";
import { Input, Label } from "reactstrap";
const approvalChoices = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "I_DONT_KNOW", label: "Don't know" },
];

export default function Question(props) {
  const { question, type, choices, _id, answer, onAnswerChange } = props;
  const changeAnswer = (event) => onAnswerChange(_id, event.target.value);

  const openAnswer = (
    <div className="answer-wrap">
      <Input
        type="text"
        autoComplete="off"
        value={answer}
        name={_id}
        aria-label={question}
        placeholder="Type in your answer"
        onChange={changeAnswer}
      />
    </div>
  );
  const multipleChoiceAnswer = (
    <div className="multiple-choice-answer-wrap multi-radio multiple-choice-wrap answer-wrap">
      {choices.map((c) => (
        <div className="choice-answer-wrap radio-wrap" key={c.letter}>
          <Input
            id={`${_id}-${c.letter}`}
            onChange={changeAnswer}
            type="radio"
            checked={c.letter === answer}
            name={_id}
            value={c.letter}
          />
          <Label
            className="mult-choice-answer-label"
            htmlFor={`${_id}-${c.letter}`}
          >
            {c.choice}
          </Label>
        </div>
      ))}
    </div>
  );
  const approvalAnswer = (
    <div className="approval-answer-wrap multi-radio approval-wrap answer-wrap">
      {approvalChoices.map(({ value, label }) => (
        <div className="approval-answer-wrap radio-wrap" key={value}>
          <Input
            id={`${_id}-${value}`}
            onChange={changeAnswer}
            type="radio"
            checked={value === answer}
            name={_id}
            value={value}
          />
          <Label htmlFor={`${_id}-${value}`}>{label}</Label>
        </div>
      ))}
    </div>
  );
  return (
    <div>
      <div className="question-label-wrap answering">
        <div className="question-count">
          <small>
            {props.order + 1}/{props.length}
          </small>
        </div>
        <div className="question-label answering question-value">{question}</div>
      </div>
      {type === MULTIPLE_CHOICE && multipleChoiceAnswer}
      {type === OPEN && openAnswer}
      {type === APPROVAL && approvalAnswer}
    </div>
  );
}

Question.propTypes = {
  onAnswerChange: propTypes.func.isRequired,
};
