import React, { useEffect, useState } from "react";
import axios from "axios";
import Question from "./Question";

function readDraft(key) {
  try {
    const draft = JSON.parse(window.localStorage.getItem(key));
    if (draft && typeof draft === "object" && !Array.isArray(draft)) {
      return draft;
    }
  } catch {
    // An unavailable or invalid draft should not prevent answering.
  }
  return {};
}

export default function GuestAnswers({ dictId }) {
  const draftKey = `spomenar:demo-answers:${dictId}`;
  const [answers, setAnswers] = useState(() => readDraft(draftKey));
  const [questions, setQuestions] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get(`/api/quests/dict/${dictId}`).then(
      ({ data }) => {
        if (active) setQuestions(data);
      },
      () => {
        if (active) setLoadFailed(true);
      }
    );
    return () => {
      active = false;
    };
  }, [dictId]);

  function saveAnswer(questionId, answer) {
    const next = { ...answers, ...readDraft(draftKey), [questionId]: answer };
    setAnswers(next);
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(next));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }

  if (loadFailed) return <p role="alert">Could not load the questions.</p>;
  if (!questions) return <p role="status">Loading questions…</p>;
  if (!questions.length) return <p>No questions yet.</p>;

  return (
    <div>
      {saveFailed ? (
        <p role="alert">This browser could not save your practice answers.</p>
      ) : (
        <p>Your practice answers are saved only in this browser.</p>
      )}
      {questions.map((question) => {
        const answer = answers[question._id];
        return (
          <Question
            {...question}
            key={question._id}
            answer={typeof answer === "string" ? answer : ""}
            length={questions.length}
            onAnswerChange={saveAnswer}
          />
        );
      })}
    </div>
  );
}
