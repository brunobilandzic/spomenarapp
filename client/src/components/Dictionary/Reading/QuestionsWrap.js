import React, { useState, useEffect } from "react";
import Question from "./Question";
import { Button, ButtonGroup } from "reactstrap";
import { addQuestions, checkAnswerCount } from "../../../actions/answerActions";
import { fetchImagesByQuestion } from "../../../actions/friendsActions";
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
    props.fetchImagesByQuestion(questions[0]._id);
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
        usernameImages={{ ...props.usernameImages }}
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
          <div
            className={classNames("question-nav-btn", {
              disabled: index == 0,
            })}
            onClick={handlePrevious}
          >
            <i class="fas fa-angle-left"></i>
          </div>

          <div
            className={classNames("question-nav-btn", {
              disabled: questions && index == questions.length - 1,
            })}
            onClick={handleNext}
          >
            {" "}
            <i class="fas fa-angle-right"></i>{" "}
          </div>
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
  fetchImagesByQuestion: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.answering.questions,
  answerCount: state.answering.answerCount,
  usernameImages: state.friends.usernameImages,
});

export default connect(mapStateToProps, {
  addQuestions,
  checkAnswerCount,
  fetchImagesByQuestion,
})(QuestionsWrap);
