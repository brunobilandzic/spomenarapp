import { Fragment } from "react";
import { Button, Input } from "reactstrap";

export default function MultipleChoice(props) {
  const choicePlaceholder = () => {
    let placeholder = "Enter choice";
    if (props.choices.length) placeholder = "Enter another choice";
    return placeholder;
  };

  const renderChoice = (choice, i) => {
    return (
      <div
        key={choice.letter}
        className="mb-2 d-flex align-items-center justify-content-between"
      >
        <div className="ml-2 choice-preview">
          <span>{choice.letter})&nbsp;</span>
          <span>{choice.choice}</span>
        </div>
        <Button
          type="button"
          color="link"
          className="custom-btn-2"
          aria-label={`Remove choice ${choice.letter}`}
          onClick={() => props.deleteChoice(i)}
        >
          <span aria-hidden="true">×</span>
        </Button>
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

        <Button type="button" color="link" className="submit-choice-btn" aria-label="Add choice" onClick={props.onSubmit}>
          <span aria-hidden="true">+</span>
        </Button>
      </div>
    </Fragment>
  );
}
