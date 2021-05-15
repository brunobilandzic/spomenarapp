import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import {
  APPROVAL,
  MULTIPLE_CHOICE,
} from "../../CreateDictionary/AddQuestion/QuestionTypes";
import axios from "axios";
import Statistics from "./Statistics/Statistics";
import { INCOGNITO_PROFILE_IMAGE } from "../../../style/images";

export default function Question(props) {
  const { question, type, choices, _id } = props;
  const [answers, setAnswers] = useState();
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/answers/quest/" + _id)
      .then((res) => {
        if (isMounted) {
          let answersTemp = [...res.data];
          if (type == MULTIPLE_CHOICE) {
            setAnswers([
              ...answersTemp.map((ans) => ({
                ...ans,
                text: choices.filter((c) => c.letter == ans.value)[0].choice,
              })),
            ]);
          } else {
            setAnswers(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [_id]);

  return (
    <div>
      {props.index == props.order && (
        <div>
          <div className="question-preview-area d-flex align-items-center">
            <div className="question-label-wrap reading">
              <div className="question-count">
                <small>
                  {props.order + 1}/{props.length}
                </small>
              </div>
              <div className="question-value">{question}</div>
            </div>
            {type === MULTIPLE_CHOICE && (
              <div className="choices answer-wrap reading-choices">
                {choices.map((c) => (
                  <div className="read-choice-preview" key={uuid()}>
                    <span className="choice-letter mr-1">{c.letter}) </span>
                    <span className="choice-value">{c.choice}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="answers-section-wrap">
            {answers != undefined &&
              answers.map((a) => (
                <div
                  className="answer-item d-flex align-items-center"
                  key={uuid()}
                >
                  <div className="answer-image-wrap">
                    <Link
                      className="app-navigation-link username-image username-image-sm"
                      to={"/" + a.author_username}
                    >
                      <img
                        className="round-box-com round-box"
                        src={
                          props.usernameImages &&
                          props.usernameImages[a.author_username]
                            ? props.usernameImages[a.author_username]
                            : INCOGNITO_PROFILE_IMAGE
                        }
                      />
                    </Link>
                  </div>
                  <div className="username-answer-wrap">
                    <div className="answer-username-value">
                      <Link
                        className="app-navigation-link"
                        to={"/" + a.author_username}
                      >
                        {a.author_username}
                      </Link>
                    </div>
                    <div className="answer-value">
                      {choices != undefined && choices.length ? (
                        <div>
                          {choices.filter((c) => c.letter == a.value)[0].choice}
                        </div>
                      ) : (
                        <div>
                          {a.value != "I_DONT_KNOW" ? a.value : "Dont Know"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {(type == MULTIPLE_CHOICE || type == APPROVAL) &&
              answers &&
              answers.length >= 1 && (
                <Statistics
                  question={_id}
                  choices={choices}
                  answers={answers}
                  type={type}
                ></Statistics>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
