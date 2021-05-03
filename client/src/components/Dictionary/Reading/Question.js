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
          <div>
            <div className="question reading-question">{question}</div>
            {type === MULTIPLE_CHOICE && (
              <div className="choices reading-choices">
                {choices.map((c) => (
                  <div key={uuid()}>
                    {c.letter}) {c.choice}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {answers != undefined &&
              choices != undefined &&
              answers.map((a) => (
                <div key={uuid()}>
                  <Link
                    className="app-navigation-link"
                    key={uuid()}
                    to={"/" + a.author_username}
                  >
                    <img
                      className="round-box-sm round-box"
                      src={
                        props.usernameImages &&
                        props.usernameImages[a.author_username]
                          ? props.usernameImages[a.author_username]
                          : INCOGNITO_PROFILE_IMAGE
                      }
                    />
                    {a.author_username}
                  </Link>
                  <div>
                    {choices.length ? (
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
              ))}
            {(type == MULTIPLE_CHOICE || type == APPROVAL) && answers && (
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
