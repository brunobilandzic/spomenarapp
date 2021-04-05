import react, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ButtonGroup,
  FormGroup,
  Label,
} from "reactstrap";
import MultipleChoice from "./MultipleChoice";
import { OPEN, MULTIPLE_CHOICE, APPROVAL } from "./QuestionTypes";
export default function QuestionModal(props) {
  const [modal, setModal] = useState(false);
  const [choice, setChoice] = useState("");
  const [error, setError] = useState("");
  const [question, setQuestion] = useState({
    question: "",
    type: OPEN,
    choices: [],
  });
  const onChangeChoice = (e) => {
    setChoice(e.target.value);
  };
  const onChangeQuestion = (e) => {
    setError("");
    setQuestion((q) => ({
      ...q,
      [e.target.name]: e.target.value,
    }));
  };
  const setType = (type) => {
    setQuestion((q) => ({
      ...q,
      type,
    }));
  };
  const onSubmitChoice = (e) => {
    if (question.choices.map((c) => c.choice).includes(choice)) {
      setError("Choices must be unique.");
    } else if (choice.length == 0) {
      setError("Choices must not be empty.");
    } else {
      setQuestion((q) => ({
        ...q,
        choices: [...q.choices, { choice, letter: null }],
      }));
      setQuestion((q) => ({
        ...q,
        choices: [
          ...q.choices.map((q_, i) => ({
            ...q_,
            letter: String.fromCharCode(97 + i),
          })),
        ],
      }));
      setError("");
    }
    setChoice("");
  };

  const deleteChoice = (i) => {
    setQuestion((q) => ({
      ...q,
      choices: q.choices.filter((c, _i) => _i != i),
    }));
    setQuestion((q) => ({
      ...q,
      choices: [
        ...q.choices.map((q_, i) => ({
          ...q_,
          letter: String.fromCharCode(97 + i),
        })),
      ],
    }));
  };
  const clearQuestion = () => {
    setQuestion({
      question: "",
      type: OPEN,
      choices: [],
    });
  };
  const toggle = () => {
    clearQuestion();
    setError("");
    setModal(!modal);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const toSend = { ...question };
    if (toSend.question.length == 0) {
      return setError("Please enter question.");
    }
    if (toSend.type != MULTIPLE_CHOICE) {
      toSend.choices = [];
    } else if (toSend.choices.length < 2) {
      return setError("Please enter at least two choices.");
    }

    props.addQuestion({ ...toSend });
    clearQuestion();
    setError("");
    toggle();
  };
  return (
    <div className="">
      <Button onClick={toggle} color="dark">
        Add Question
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add another question</ModalHeader>
        <ModalBody>
          <p>
            <b>Question Type:</b>
          </p>
          <ButtonGroup>
            <Button
              className="mr-2"
              color="primary"
              onClick={() => setType(OPEN)}
              active={question.type === OPEN}
            >
              Open
            </Button>
            <Button
              className="mr-2"
              color="primary"
              onClick={() => setType(MULTIPLE_CHOICE)}
              active={question.type === MULTIPLE_CHOICE}
            >
              Multiple Choice
            </Button>
            <Button
              color="primary"
              onClick={() => setType(APPROVAL)}
              active={question.type === APPROVAL}
            >
              Approval
            </Button>
          </ButtonGroup>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="question">Question:</Label>
              <textarea
                className="form-control"
                rows={2}
                type="text"
                value={question.question}
                onChange={onChangeQuestion}
                autoComplete="off"
                name="question"
              />
            </FormGroup>
            {question.type === MULTIPLE_CHOICE && (
              <MultipleChoice
                choice={choice}
                choices={question.choices}
                onChange={onChangeChoice}
                onSubmit={onSubmitChoice}
                deleteChoice={deleteChoice}
              />
            )}
            {error}
            <div className="modal-navigation">
              <Button type="submit" color="success" onClick={onSubmit}>
                Finish
              </Button>
              <Button onClick={toggle}>Cancel</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}
