import React, { useState, useEffect } from "react";
import Question from "./Question";
import { Button, ButtonGroup, Form } from "reactstrap";
import InformationModal from "../../Modals/InformationModal";
import {
  addQuestions,
  postAnswers,
  checkIfAnswered,
} from "../../../actions/answerActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import classNames from "classnames";

function QuestionsWrap(props) {
  const { dictId, questions } = props;
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState({
    answered: false,
    emptyAnswers: false,
  });

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      props.addQuestions(dictId);
    }
    return () => {
      isMounted = false;
    };
  }, [dictId]);
  useEffect(() => {
    if (questions.length) props.checkIfAnswered(questions[0]._id);
  }, [questions]);

  useEffect(() => {
    if (!questions.length) return;
  });

  function onSubmit(e) {
    e.preventDefault();
    if (
      questions.filter((q) => q.answer == null || q.answer === "").length > 0
    ) {
      return setModal({ ...modal, emptyAnswers: true });
    }
    props.postAnswers(dictId);
    toggleModal("answered");
  }

  function handlePrevious() {
    if (index == 0) return;
    setIndex(index - 1);
  }

  function handleNext() {
    if (index == questions.length - 1) return;
    setIndex(index + 1);
  }

  function toggleModal(type) {
    setModal({
      ...modal,
      [type]: !modal[type],
    });
    if (type == "answered" && modal.answered) window.location.pathname = "/";
  }

  function renderQuestions() {
    if (questions === null) {
      return "...Loading";
    }
    return questions.map((q, i) => (
      <Question index={index} {...q} key={q._id} />
    ));
  }

  return (
    <div>
      {props.isAnswered ? (
        <div>You already answered this dictionary.</div>
      ) : !props.isAuthenticated ? (
        <div>Please register or log in in order to answer the dictionary.</div>
      ) : (
        <div>
          <InformationModal
            modal={modal.answered}
            toggle={() => {
              toggleModal("answered");
            }}
            modalHeader={"Answered"}
            modalBody={"You have successfully answered the dictionary."}
          />
          <InformationModal
            modal={modal.emptyAnswers}
            toggle={() => {
              toggleModal("emptyAnswers");
            }}
            modalHeader={"Wait a minute"}
            modalBody={"You haven't answered all questions."}
          />
          <div>{renderQuestions()}</div>
          <ButtonGroup>
            <Button
              className={classNames("nav-btn", { disabled: index == 0 })}
              onClick={handlePrevious}
            >
              {" "}
              &lt;{" "}
            </Button>
            <Button
              className={classNames("nav-btn", {
                disabled: questions && index == questions.length - 1,
              })}
              onClick={handleNext}
            >
              {" "}
              &gt;{" "}
            </Button>
          </ButtonGroup>
          {questions && index == questions.length - 1 && (
            <Button onClick={onSubmit} type="submit">
              Submit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

QuestionsWrap.propTypes = {
  questions: propTypes.array.isRequired,
  isAnswered: propTypes.bool,
  addQuestions: propTypes.func.isRequired,
  postAnswers: propTypes.func.isRequired,
  checkIfAnswered: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool,
};

const mapStateToProps = (state) => ({
  questions: state.answering.questions,
  isAnswered: state.answering.isAnswered,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  addQuestions,
  postAnswers,
  checkIfAnswered,
})(QuestionsWrap);
