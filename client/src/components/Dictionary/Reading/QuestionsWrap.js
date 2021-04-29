import React, { useState, useEffect } from "react";
import Question from "./Question";
import { Button, ButtonGroup } from "reactstrap";
import { addQuestions, checkAnswerCount } from "../../../actions/answerActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import classNames from "classnames";

function QuestionsWrap(props) {
  const { dictId, questions } = props;
  const [index, setIndex] = useState(0);
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
    if (!questions.length) return;
    props.checkAnswerCount(questions[0]._id);
  }, [questions]);

  function handlePrevious() {
    if (index == 0) return;
    setIndex(index - 1);
  }

  function handleNext() {
    if (index == questions.length - 1) return;
    setIndex(index + 1);
  }

  function renderQuestions() {
    if (questions === null) {
      return "...Loading";
    }
    return questions.map((q) => <Question index={index} {...q} key={q._id} />);
  }
  return (
    <div>
      <div>
        {!props.answerCount && (
          <div className="no-answers">No answers yet.</div>
        )}
      </div>
      <div>{renderQuestions()}</div>
      <ButtonGroup>
        <Button
          className={classNames("nav-btn", { disabled: index == 0 })}
          onClick={handlePrevious}
          active="false"
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
    </div>
  );
}

QuestionsWrap.propTypes = {
  questions: propTypes.array.isRequired,
  addQuestions: propTypes.func.isRequired,
  checkAnswerCount: propTypes.func.isRequired,
  answerCount: propTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.answering.questions,
  answerCount: state.answering.answerCount,
});

export default connect(mapStateToProps, { addQuestions, checkAnswerCount })(
  QuestionsWrap
);
