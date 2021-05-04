import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import AnsweringQuestionsWrap from "./Answering/QuestionsWrap";
import ReadingQuestionsWrap from "./Reading/QuestionsWrap";
import { ButtonGroup, Button } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import DictionaryItemBig from "./DictionaryItemBig";

const READING = "READING";
const ANSWERING = "ANSWERING";

function Dictionary(props) {
  const [dictionary, setDictionary] = useState(null);
  const [mode, setMode] = useState(ANSWERING);
  const [control, setControl] = useState(false);
  let { dictId } = useParams();
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/dicts/" + dictId)
      .then((response) => {
        if (isMounted) setDictionary(response.data);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [dictId]);

  useEffect(() => {
    if (!dictionary || !props.user) return;
    if (props.user.id == dictionary.author) setControl(true);
  }, [dictionary, props.user]);

  return (
    <div className="dictionary-wrap">
      {dictionary && (
        <DictionaryItemBig control={control} dict={dictionary} big={true} />
      )}
      <ButtonGroup className="answer-read-btn-group">
        <Button
          color="light"
          className="mr-2 answer-read-btn"
          active={mode == ANSWERING}
          onClick={() => setMode(ANSWERING)}
        >
          Answer
        </Button>
        <Button
          color="light"
          className="answer-read-btn"
          active={mode == READING}
          onClick={() => setMode(READING)}
        >
          Read
        </Button>
      </ButtonGroup>
      {mode == ANSWERING ? (
        <AnsweringQuestionsWrap dictId={dictId} />
      ) : (
        <ReadingQuestionsWrap dictId={dictId} />
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
