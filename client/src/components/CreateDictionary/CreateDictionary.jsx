import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "reactstrap";
import QuestionModal from "./AddQuestion/QuestionModal";
import InformationModal from "../Modals/InformationModal";
import PreviewQuestion from "../Dictionary/Answering/Question";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { v4 as uuid } from "uuid";
import axios from "axios";
import "../../style/dictionary/spacing.scss";
import "../../style/dictionary/graphic.scss";

const practiceDraftKey = "spomenar:demo-create";
const emptyDraft = { title: "", description: "", questions: [] };

function readPracticeDraft() {
  try {
    const draft = JSON.parse(window.localStorage.getItem(practiceDraftKey));
    if (
      typeof draft?.title === "string" &&
      typeof draft.description === "string" &&
      Array.isArray(draft.questions) &&
      draft.questions.every((item) =>
        typeof item?.id === "string" &&
        typeof item.question === "string" &&
        Array.isArray(item.choices)
      )
    ) {
      return draft;
    }
  } catch {
    // Start with an empty draft if browser storage is unavailable.
  }
  return emptyDraft;
}

export function CreateDictionary({ practice = false, token, user }) {
  const [draft, setDraft] = useState(() => (practice ? readPracticeDraft() : emptyDraft));
  const { title, description, questions } = draft;
  const [preview, setPreview] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [modal, setModal] = useState({
    success: false,
    fail: false,
  });
  const [error, setError] = useState("");
  const [dictId, setDictId] = useState("");

  useEffect(() => {
    if (!practice) return;
    try {
      window.localStorage.setItem(practiceDraftKey, JSON.stringify(draft));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [draft, practice]);

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
    const item = { ...question, id: uuid() };
    setDraft((current) => ({ ...current, questions: [...current.questions, item] }));
    setError("");
  };
  const deleteQuestion = (id) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.filter((question) => question.id !== id),
    }));
  };
  const clearDictionary = () => {
    setDraft(emptyDraft);
    setError("");
  };
  const onChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setDraft((current) => ({ ...current, [name]: value }));
  };
  const updatePracticeAnswer = (questionId, value) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((item) =>
        item.id === questionId ? { ...item, answer: value } : item
      ),
    }));
  };

  const submitDictionary = () => {
    if (!practice && !user) return toggleFail();
    if (!title || !description || questions.length === 0) {
      return setError("Please enter all fields.");
    }
    if (title.length > 100) {
      return setError("Title must contain at most 100 characters.");
    }
    if (practice) {
      setError("");
      setPreview(true);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    const body = {
      author: user.id,
      author_username: user.username,
      title,
      description,
    };
    axios
      .post("/api/dicts", body, config)
      .then((res) => {
        setDictId(res.data._id);
        const questionsData = {
          dictionary: res.data._id,
          questions: questions.map(({ question, type, choices }, order) => ({
            question, type, choices, order,
          })),
        };
        axios
          .post("/api/quests", questionsData, config)
          .then((_) => {
            clearDictionary();
            toggleSuccess();
          })
          .catch((err) => {
            console.log(err);
            toggleFail();
          });
      })
      .catch((err) => {
        toggleFail();
        console.log(err.response.data);
      });
  };
  function renderQuestion(question, index) {
    return (
      <div key={question.id} className="question-list-item-wrap mb-2">
        <div className="d-flex justify-content-between align-items-center question-highlight">
          <div className="value mr-2">
            {index + 1 + ") " + question.question}
          </div>
          <div className="delete-type d-flex align-items-center ">
            <div className="type">
              <small className="type">{question.type}</small>
            </div>
            <button
              type="button"
              className="custom-btn-2 delete-question-btn btn btn-link"
              aria-label={`Delete question ${index + 1}`}
              onClick={() => deleteQuestion(question.id)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div>
          {question.choices.length != 0 && (
            <div className="create-choices-wrap">
              {question.choices.map((c) => (
                <div key={c.letter}>
                  {c.letter})&nbsp;<span>{c.choice}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const storageMessage = saveFailed ? (
    <p role="alert">This browser could not save your practice spomenar.</p>
  ) : (
    <p>Your practice spomenar is saved only in this browser.</p>
  );

  if (practice && preview) {
    return (
      <section>
        <h1>{title}</h1>
        <p>{description}</p>
        {storageMessage}
        <Button type="button" onClick={() => setPreview(false)}>
          Back to editing
        </Button>
        {questions.map(({ id, answer, ...question }, order) => (
          <PreviewQuestion
            {...question}
            key={id}
            _id={id}
            order={order}
            length={questions.length}
            answer={typeof answer === "string" ? answer : ""}
            onAnswerChange={updatePracticeAnswer}
          />
        ))}
      </section>
    );
  }

  return (
    <div className="create-dictionary">
      {practice && (
        <>
          <h1>Create a practice spomenar</h1>
          {storageMessage}
        </>
      )}
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
          <Label for="dictionary-title">Title</Label>
          <Input
            id="dictionary-title"
            type="text"
            name="title"
            value={title}
            className="meta-input"
            onChange={onChange}
            placeholder="Dictionary title..."
            autoComplete="off"
          />
          <Label for="dictionary-description">Description</Label>
          <textarea
            id="dictionary-description"
            name="description"
            value={description}
            className="form-control meta-input"
            onChange={onChange}
            placeholder="Dictionary description..."
            rows={2}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="qeustions-preview">{questions.map(renderQuestion)}</div>

      <QuestionModal
        count={questions.length}
        addQuestion={(q) => {
          addQuestion(q);
        }}
      />
      <div className="modal-navigation create">
        <p style={{ color: "red" }}>
          <b>{error}</b>
        </p>
        <Button onClick={submitDictionary} color="success">
          {practice ? "Preview spomenar" : "Finish Dictionary"}
        </Button>
        <Button
          onClick={() => {
            if (!window.confirm("Do you want to discard this spomenar?")) return;
            if (practice) clearDictionary();
            else window.location.pathname = "/";
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
  practice: propTypes.bool,
  token: propTypes.string,
  user: propTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(mapStateToProps, {})(CreateDictionary);
