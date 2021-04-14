import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { MULTIPLE_CHOICE } from "../../CreateDictionary/AddQuestion/QuestionTypes";
import axios from "axios";
import Username from "../../Render/Username";

export default function Question(props) {
  const { question, type, choices, _id } = props;
  const [answers, setAnswers] = useState();
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/answers/quest/" + _id)
      .then((res) => {
        if (isMounted) setAnswers(res.data);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [_id]);

  return (
    <div>
      <div>
        <div>{question}</div>
        {type === MULTIPLE_CHOICE &&
          choices.map((c) => (
            <div key={uuid()}>
              {c.letter}. {c.choice}
            </div>
          ))}
      </div>
      <div>
        {answers != undefined &&
          answers.map((a) => (
            <div key={uuid()}>
              <Username userId={a.author} />: {a.value}
            </div>
          ))}
      </div>
    </div>
  );
}
