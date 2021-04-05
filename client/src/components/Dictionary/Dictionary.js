import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import DictionaryItem from "../Dictionaries/DictionaryItem";
import AnsweringQuestionsWrap from "./Answering/QuestionsWrap";
import ReadingQuestionsWrap from "./Reading/QuestionsWrap";
import { ButtonGroup, Button } from "reactstrap";

const READING = "READING";
const ANSWERING = "ANSWERING";

export default function Dictionary() {
  const [dictionary, setDictionary] = useState(null);
  const [mode, setMode] = useState(ANSWERING);
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

  return (
    <div className="dictionary-wrap">
      {dictionary && <DictionaryItem dict={dictionary} big={true} />}
      <ButtonGroup>
        <Button
          className="mr-2"
          active={mode == ANSWERING}
          onClick={() => setMode(ANSWERING)}
        >
          Answer
        </Button>
        <Button active={mode == READING} onClick={() => setMode(READING)}>
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
