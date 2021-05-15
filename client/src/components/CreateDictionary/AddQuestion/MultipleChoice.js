import react, { Fragment } from "react";
import { Button, Input } from "reactstrap";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
import propTypes from "prop-types";

export default function MultipleChoice(props) {
  const choicePlaceholder = () => {
    let placeholder = "Enter choice";
    if (props.choices.length) placeholder = "Enter another choice";
    return placeholder;
  };

  const renderChoice = (choice, i) => {
    return (
      <div
        key={uuid()}
        className="mb-2 d-flex align-items-center justify-content-between"
      >
        <div className="ml-2 choice-preview">
          <span>{choice.letter})&nbsp;</span>
          <span>{choice.choice}</span>
        </div>
        <div
          className="custom-btn-2"
          onClick={() => {
            props.deleteChoice(i);
          }}
        >
          <i class="fas fa-trash"></i>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div>Choices</div>
      <div className="choices-preview-wrap mt-2 mb-2">
        {props.choices.map(renderChoice)}
      </div>
      <div className="input-choice">
        <Input
          autoComplete="off"
          className="newchoice"
          type="text"
          name="newchoice"
          value={props.choice}
          onChange={props.onChange}
          placeholder={choicePlaceholder()}
        />

        <i class="fas fa-plus submit-choice-btn " onClick={props.onSubmit}></i>
      </div>
    </Fragment>
  );
}
