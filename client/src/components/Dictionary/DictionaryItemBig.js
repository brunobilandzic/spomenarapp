import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import parseDate from "../../helpers/date";
import {
  GENERIC_DICTIONARY_IMAGE,
  INCOGNITO_PROFILE_IMAGE,
} from "../../style/images";
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
      <div>
        <img
          className="dict-info-image"
          src={dict.imageUrl ? dict.imageUrl : GENERIC_DICTIONARY_IMAGE}
        />
      </div>
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
              <div className="dict-info-author username-image-sm username-image">
                <img
                  className="round-box round-box-sm"
                  src={
                    props.imageUrl ? props.imageUrl : INCOGNITO_PROFILE_IMAGE
                  }
                />
                <div>{dict.author_username}</div>
              </div>
            </Link>
            <div className="answer-count-wrap d-flex">
              <div className="answer-count-icon mr-2">
                <i class="fas fa-user dark-blue"></i>
              </div>
              <div classNam="answer-count-count">{count}</div>
            </div>
            <div className="dict-item-date">{parseDate(dict.date)}</div>
          </div>
          <div>{props.control && <DictionaryControl dict={dict.id} />}</div>
        </div>
      </div>
    </div>
  );
}
