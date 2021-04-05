import React, { useState, useEffect } from "react";
import Question from "./Question";
import { Button } from "reactstrap";
import { addQuestions } from "../../../actions/answerActions";
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

  function renderQuestions() {
    if (questions === null) {
      return "...Loading";
    }
    return questions.map((q) => <Question {...q} key={q._id} />);
  }
  return <div>{renderQuestions()}</div>;
}

QuestionsWrap.propTypes = {
  questions: propTypes.array.isRequired,
  addQuestions: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.answering.questions,
});

export default connect(mapStateToProps, { addQuestions })(QuestionsWrap);
