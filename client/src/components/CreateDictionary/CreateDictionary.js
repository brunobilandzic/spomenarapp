import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import propTypes from "prop-types";
import { connect } from "react-redux";
import QuestionModal from "./AddQuestion/QuestionModal";
import InformationModal from "../Modals/InformationModal";
import { v4 as uuid } from "uuid";
import axios from "axios";
export default function CreateDictionary(props) {
  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({
    success: false,
    fail: false,
  });
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const toggleSuccess = () => {
    setModal({
      ...modal,
      success: !modal.success,
    });
  };
  const toggleFail = () => {
    setModal({
      ...modal,
      fail: !modal.fail,
    });
  };
  const addQuestion = (question) => {
    setQuestions((q) => [...q, { ...question, key: uuid() }]);
    setError("");
  };
  const deleteQuestion = (index) => {
    setQuestions((q) => q.filter((_, __) => __ != index));
  };
  const clearDictionary = () => {
    setMeta({
      title: "",
      description: "",
    });
    setQuestions([]);
  };
  const onChange = (e) => {
    setError("");
    setMeta((m) => ({
      ...m,
      [e.target.name]: e.target.value,
    }));
  };
  function renderQuestion(question, index) {
    return (
      <li key={uuid()} className="">
        <div className="question-preview">
          <div>
            <div className="">TYPE:&nbsp;{question.type}</div>
            <div className="">{question.question}</div>
            {question.choices.length != 0 && (
              <div>
                <div>Choices:</div>
                <ol>
                  {question.choices.map((c) => (
                    <li key={uuid()}>
                      <div>{c.letter}</div>
                      <div>{c.choice}</div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div>
            <Button
              color="danger"
              onClick={() => {
                deleteQuestion(index);
              }}
            >
              X
            </Button>
          </div>
        </div>
      </li>
    );
  }
  const submitDictionary = () => {
    if (
      meta.title.length == 0 ||
      meta.description.length == 0 ||
      questions.length == 0
    ) {
      return setError("Please enter all fields.");
    }
    axios
      .post("/api/dicts", {
        author: "bruzo1950",
        title: meta.title,
        description: meta.description,
      })
      .then((res) => {
        axios
          .post("/api/quests", {
            dictionary: res.data._id,
            questions: [...questions.map((q, order) => ({ ...q, order }))],
          })
          .then((quests) => {
            clearDictionary();
            toggleSuccess();
          })
          .catch((err) => {
            toggleFail();
          });
      })
      .catch((err) => {
        toggleFail();
      });
  };

  return (
    <div className="create-dictionary">
      <InformationModal
        modal={modal.success}
        toggle={toggleSuccess}
        modalHeader={"Success"}
        modalBody={"Dictionary created"}
      />
      <InformationModal
        modal={modal.fail}
        toggle={toggleFail}
        modalHeader={"Fail"}
        modalBody={"Something went wrong."}
      />
      <Input
        type="text"
        name="title"
        value={meta.title}
        onChange={onChange}
        placeholder="Dictionary title..."
      />
      <textarea
        type="text"
        name="description"
        value={meta.description}
        className="form-control"
        onChange={onChange}
        placeholder="Dictionary description..."
        rows={3}
      />
      <ol>{questions.map(renderQuestion)}</ol>
      <QuestionModal
        addQuestion={(q) => {
          addQuestion(q);
        }}
      />
      <div className="modal-navigation">
        <p style={{ color: "red" }}>
          <b>{error}</b>
        </p>
        <Button onClick={submitDictionary} color="success">
          Finish
        </Button>
        <Button
          onClick={() => {
            window.location.pathname = "/";
          }}
          color=""
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}