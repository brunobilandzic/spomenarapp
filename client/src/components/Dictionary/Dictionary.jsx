import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import AnsweringQuestionsWrap from "./Answering/QuestionsWrap";
import GuestAnswers from "./Answering/GuestAnswers";
import ReadingQuestionsWrap from "./Reading/QuestionsWrap";
import { ButtonGroup, Button } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import DictionaryItemBig from "./DictionaryItemBig";

const READING = "READING";
const ANSWERING = "ANSWERING";

function Dictionary(props) {
  const [dictionary, setDictionary] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedMode, setMode] = useState(null);
  const [control, setControl] = useState(false);
  const { dictId } = useParams();
  const guestDemo = import.meta.env.DEMO_MODE && !props.isAuthenticated;
  const mode = selectedMode ?? (guestDemo ? READING : ANSWERING);
  useEffect(() => {
    let isMounted = true;
    setDictionary(null);
    setLoadFailed(false);
    axios
      .get("/api/dicts/" + dictId)
      .then((response) => {
        if (isMounted) setDictionary(response.data);
      })
      .catch(() => {
        if (isMounted) setLoadFailed(true);
      });
    return () => {
      isMounted = false;
    };
  }, [dictId]);

  useEffect(() => {
    if (!dictionary || !props.user) return;
    if (props.user.id == dictionary.author) setControl(true);
  }, [dictionary, props.user]);

  if (loadFailed) return <p role="alert">Could not open this spomenar.</p>;
  if (!dictionary) return <p role="status">Loading spomenar…</p>;

  return (
    <div className="dictionary-wrap">
      <DictionaryItemBig control={control} dict={dictionary} big={true} />
      <ButtonGroup className="answer-read-btn-group">
        <Button
          color="light"
          className="mr-2 btn-group-btn"
          active={mode == ANSWERING}
          onClick={() => setMode(ANSWERING)}
        >
          {guestDemo ? "Try answering" : "Answer"}
        </Button>
        <Button
          color="light"
          className="btn-group-btn"
          active={mode == READING}
          onClick={() => setMode(READING)}
        >
          Read
        </Button>
      </ButtonGroup>
      {mode == READING ? (
        <ReadingQuestionsWrap dictId={dictId} />
      ) : guestDemo ? (
        <GuestAnswers key={dictId} dictId={dictId} />
      ) : (
        <AnsweringQuestionsWrap
          dictId={dictId}
          changeToRead={() => setMode(READING)}
        />
      )}
    </div>
  );
}

Dictionary.propTypes = {
  isAuthenticated: propTypes.bool,
  user: propTypes.object,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Dictionary);
