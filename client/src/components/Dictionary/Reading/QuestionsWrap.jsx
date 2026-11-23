import React, { useState, useEffect } from "react";
import Question from "./Question";
import { addQuestions, checkAnswerCount } from "../../../actions/answerActions";
import { connect } from "react-redux";
import propTypes from "prop-types";

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
    return questions.map((q) => (
      <Question
        index={index}
        length={questions.length}
        {...q}
        key={q._id}
      />
    ));
  }
  return (
    <div>
      <div className="render-questions-wrap reading">{renderQuestions()}</div>
      <div>
        {!props.answerCount && (
          <div className="no-answers text-center">No answers yet.</div>
        )}
      </div>
      <div className="question-navigation-wrap">
        <div className="question-navigation">
          <button
            type="button"
            className="question-nav-btn"
            aria-label="Previous question"
            disabled={index === 0}
            onClick={handlePrevious}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <button
            type="button"
            className="question-nav-btn"
            aria-label="Next question"
            disabled={!questions?.length || index === questions.length - 1}
            onClick={handleNext}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
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

export default connect(mapStateToProps, {
  addQuestions,
  checkAnswerCount,
})(QuestionsWrap);
