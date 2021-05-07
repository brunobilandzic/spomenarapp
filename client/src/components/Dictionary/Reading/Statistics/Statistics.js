import React, { useState, useEffect } from "react";
import { Progress } from "reactstrap";
import {
  APPROVAL,
  MULTIPLE_CHOICE,
} from "../../../CreateDictionary/AddQuestion/QuestionTypes";
import { v4 as uuid } from "uuid";
const colors = {
  Yes: "success",
  No: "danger",
  I_DONT_KNOW: "info",
};

export default function Statistic(props) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let values;
    if (props.type == MULTIPLE_CHOICE)
      values = props.choices.map((c) => c.letter);
    else values = Array.from(new Set(props.answers.map((a) => a.value)));
    const answers = props.answers.map((a) => a.value);
    console.log(values);
    console.log(answers);
    let statsTemp = values.map((value) => ({
      value,
      count: answers.filter((a) => a == value).length,
    }));
    setStats([...statsTemp.sort((a, b) => b.count - a.count)]);
  }, [props._id]);

  const approvalStats = (
    <div>
      <Progress className="stat-bar approval-bar" multi>
        {stats &&
          stats
            .sort((a, b) => {
              if (a.value == "Yes") return -1;
              else if (a.value == "No") return 0;
              else return 0;
            })
            .map((stat) => (
              <Progress
                key={uuid()}
                bar
                color={colors[stat.value]}
                value={stat.count}
                max={props.answers.length}
              >
                {stat.value == "I_DONT_KNOW" ? "Dont Know" : stat.value}{" "}
                {((stat.count / props.answers.length) * 100).toFixed(2) + " %"}
              </Progress>
            ))}
      </Progress>
    </div>
  );
  const multipleChoiceStats = (
    <div>
      {stats &&
        props.choices.length &&
        stats.map((stat) => (
          <div className="text-center" key={uuid()}>
            <div>
              {props.choices.filter((c) => c.letter == stat.value)[0].choice}
            </div>
            <Progress
              className="stat-bar mult-choice-bar"
              value={stat.count}
              max={props.answers.length}
            >
              {((stat.count / props.answers.length) * 100).toFixed(2) + " %"}
            </Progress>
            <br></br>
          </div>
        ))}
    </div>
  );
  return (
    <div className="statistics-wrap">
      <div className="statistics-head text-center">
        <i class="far fa-chart-bar"></i>
      </div>
      {props.type == APPROVAL && approvalStats}
      {props.type == MULTIPLE_CHOICE && multipleChoiceStats}
    </div>
  );
}
