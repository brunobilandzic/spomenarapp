import react, { Fragment } from "react";
import { Button, Input } from "reactstrap";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
import propTypes from "prop-types";

export default function MultipleChoice(props) {
  const renderChoice = (choice, i) => {
    return (
      <div key={uuid()} className="mb-2">
        <Button
          onClick={() => {
            props.deleteChoice(i);
          }}
          color="danger"
          className="list-delete-btn"
        >
          X
        </Button>
        <span className="ml-2">{i + 1}&nbsp;</span>
        <span>{choice.letter}</span>
        <span>{choice.choice}</span>
      </div>
    );
  };

  return (
    <Fragment>
      <p>
        <b>Choices</b>
      </p>
      <hr></hr>
      {props.choices.map(renderChoice)}
      <hr></hr>
      <div className="input-submit">
        <Input
          autoComplete="off"
          type="text"
          name="newchoice"
          value={props.choice}
          onChange={props.onChange}
          placeholder="Add choice..."
        />
        <Button
          className="input-submit-submit"
          color="success"
          onClick={props.onSubmit}
        >
          +
        </Button>
      </div>
    </Fragment>
  );
}
