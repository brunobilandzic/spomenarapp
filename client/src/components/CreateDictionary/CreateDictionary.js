import React, { useState } from "react";
import { Button, Input, Label } from "reactstrap";
import QuestionModal from "./AddQuestion/QuestionModal";
import InformationModal from "../Modals/InformationModal";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { MULTIPLE_CHOICE } from "./AddQuestion/QuestionTypes";

function CreateDictionary(props) {
  const [questions, setQuestions] = useState([]);
  const [modal, setModal] = useState({
    success: false,
    fail: false,
  });
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [dictId, setDictId] = useState("");
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
    setQuestions((q) => [...q, { ...question }]);
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

  const submitDictionary = () => {
    if (!props.user) return toggleFail();
    if (
      meta.title.length == 0 ||
      meta.description.length == 0 ||
      questions.length == 0
    ) {
      return setError("Please enter all fields.");
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    if (props.token) {
      config.headers["x-auth-token"] = props.token;
    }
    const body = {
      author: props.user.id,
      author_username: props.user.username,
      title: meta.title,
      description: meta.description,
    };
    const formData = new FormData();
    Object.keys(body).forEach((key) => formData.append(key, body[key]));
    formData.append("image", meta.image);
    axios
      .post("/api/dicts", formData, config)
      .then((res) => {
        setDictId(res.data._id);
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
        console.log(err.response.data);
      });
  };
  const onChangeImage = (e) => {
    console.log(e.target.files[0]);
    setMeta((m) => ({
      ...m,
      image: e.target.files[0],
    }));
  };
  function renderQuestion(question, index) {
    return (
      <div key={uuid()} className="question-list-item-wrap mb-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="value mr-2">
            {index + 1 + ") " + question.question}
          </div>
          <div className="value-type d-flex align-items-center ">
            <div className="type">
              <small className="type">{question.type}</small>
            </div>
            <div
              className="custom-btn-2"
              onClick={() => {
                deleteQuestion(index);
              }}
            >
              <i class="fas fa-trash"></i>
            </div>
          </div>
        </div>
        <div>
          {question.choices.length != 0 && (
            <div className="choices-wrap ml-3">
              {question.choices.map((c) => (
                <div key={uuid()}>
                  {c.letter})&nbsp;<span>{c.choice}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="create-dictionary">
      <InformationModal
        modal={modal.success}
        toggle={toggleSuccess}
        modalHeader={"Success"}
        modalBody={
          "Dictionary created. Share it with friends via the link below."
        }
        modalPath={"dictionary/" + dictId}
      />
      <InformationModal
        modal={modal.fail}
        toggle={toggleFail}
        modalHeader={"Fail"}
        modalBody={"Something went wrong."}
      />
      <div className="create-dictionary-meta">
        <div className="title-description">
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={meta.title}
            className="meta-input"
            onChange={onChange}
            placeholder="Dictionary title..."
          />
          <Label>Description</Label>
          <textarea
            type="text"
            name="description"
            value={meta.description}
            className="form-control meta-input"
            onChange={onChange}
            placeholder="Dictionary description..."
            rows={2}
          />
          <div className="img-upload dict-img-upload">
            <Label>
              Image <i>(optional)</i>
            </Label>
            <div>Make your dictionary more appealing</div>
            <input
              onChange={onChangeImage}
              accept=".jpg,.png"
              type="file"
              name="image"
            />
          </div>
        </div>
      </div>
      <div className="qeustions-preview">{questions.map(renderQuestion)}</div>

      <QuestionModal
        count={questions.length}
        addQuestion={(q) => {
          addQuestion(q);
        }}
      />
      <div className="modal-navigation">
        <p style={{ color: "red" }}>
          <b>{error}</b>
        </p>
        <Button onClick={submitDictionary} color="success">
          Finish Dictionary
        </Button>
        <Button
          onClick={() => {
            window.location.pathname = "/";
          }}
          color="danger"
        >
          Discard
        </Button>
      </div>
    </div>
  );
}

CreateDictionary.propTypes = {
  user: propTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps, {})(CreateDictionary);
