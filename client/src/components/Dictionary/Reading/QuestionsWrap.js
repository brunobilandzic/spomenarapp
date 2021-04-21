import React, { useState, useEffect } from "react";
import Question from "./Question";
import { Button } from "reactstrap";
import { addQuestions, checkAnswerCount } from "../../../actions/answerActions";
import { connect } from "react-redux";
import propTypes from "prop-types";

function QuestionsWrap(props) {
  const { dictId, questions } = props;
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

  function renderQuestions() {
    if (questions === null) {
      return "...Loading";
    }
    return questions.map((q) => <Question {...q} key={q._id} />);
  }
  return (
    <div>
      <div>
        {!props.answerCount && (
          <div className="no-answers">No answers yet.</div>
        )}
      </div>
      <div>{renderQuestions()}</div>
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
