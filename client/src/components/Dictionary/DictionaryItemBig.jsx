import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import parseDate from "../../helpers/date";
import "../../style/dictionary/spacing.scss";
import "../../style/dictionary/graphic.scss";
import DictionaryControl from "./DictionaryControl";
import axios from "axios";

export default function DictionaryItemBig(props) {
  const { dict } = props;
  const [count, setCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/answers/dict/count/" + dict._id)
      .then((res) => {
        if (isMounted) setCount(res.data.count);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  });

  return (
    <div className="dict-info">
      <div className="dict-info-text">
        <div>
          <div className="dict-info-title">
            <b className="">{dict.title}</b>
          </div>
          <div className="dict-description">{dict.description}</div>
        </div>
        <div className="dict-info-footer d-flex justify-content-between">
          <div className="dict-author-date">
            <Link
              className="app-navigation-link"
              to={"/" + dict.author_username}
            >
              {dict.author_username}
            </Link>
            <div className="answer-count-wrap d-flex">
              <div className="answer-count-icon mr-2">
                <i className="fas fa-user dark-blue"></i>
              </div>
              <div className="answer-count-count">{count}</div>
            </div>
            <div className="dict-item-date">{parseDate(dict.date)}</div>
          </div>
          <div>{props.control && <DictionaryControl dict={dict._id} />}</div>
        </div>
      </div>
    </div>
  );
}
