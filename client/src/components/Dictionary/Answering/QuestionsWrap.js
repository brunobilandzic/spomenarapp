import React, { useState, useEffect } from "react";
import Question from "./Question";
import { Button, Form } from "reactstrap";
import InformationModal from "../../Modals/InformationModal";
import { addQuestions, postAnswers } from "../../../actions/answerActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import axios from "axios";
function QuestionsWrap(props) {
  const { dictId, questions } = props;
  const [modal, setModal] = useState({
    answered: false,
    emptyAnswers: false,
  });

  function onSubmit(e) {
    e.preventDefault();
    if (
      questions.filter((q) => q.answer == null || q.answer === "").length > 0
    ) {
      return setModal({ ...modal, emptyAnswers: true });
    }
    props.postAnswers(dictId, (res) => {
      toggleModal("answered");
      console.log(res.data);
    });
  }
  function toggleModal(type) {
    setModal({
      ...modal,
      [type]: !modal[type],
    });
    if (type == "answered" && modal.answered) window.location.pathname = "/";
  }
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
  return (
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
      <Form onSubmit={onSubmit}>{renderQuestions()}</Form>
      <Button onClick={onSubmit} type="submit">
        Submit
      </Button>
    </div>
  );
}

QuestionsWrap.propTypes = {
  questions: propTypes.array.isRequired,
  addQuestions: propTypes.func.isRequired,
  postAnswers: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.answering.questions,
});

export default connect(mapStateToProps, { addQuestions, postAnswers })(
  QuestionsWrap
);
