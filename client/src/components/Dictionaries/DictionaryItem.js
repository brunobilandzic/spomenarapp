import React from "react";
import { Link } from "react-router-dom";
import parseDate from "../../helpers/date";
import { INCOGNITO_PROFILE_IMAGE } from "../../style/images";
export default function DictionaryItem(props) {
  const { dict } = props;

  return (
    <div className="dict-item">
      <div className="dict-item-head">
        <div>
          <Link to={`/dictionary/${dict._id}`} className="app-navigation-link">
            <b>{dict.title}</b>
          </Link>
        </div>
        <div>
          <Link className="app-navigation-link" to={"/" + dict.author_username}>
            <img
              className="round-box round-box-sm"
              src={props.imageUrl ? props.imageUrl : INCOGNITO_PROFILE_IMAGE}
            />
            {dict.author_username}
          </Link>
        </div>
      </div>
      <div className="">{dict.description}</div>
      <div className="">{parseDate(dict.date)}</div>
    </div>
  );
}
