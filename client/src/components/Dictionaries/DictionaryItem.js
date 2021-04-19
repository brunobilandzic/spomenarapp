import React from "react";
import { Link } from "react-router-dom";
export default function DictionaryItem(props) {
  const { dict } = props;

  return (
    <div className="">
      <div className="">
        <Link to={`/dictionary/${dict._id}`} className="app-navigation-link">
          <b>{dict.title}</b>
        </Link>
      </div>
      <div className="">{dict.description}</div>
      <div className="">{dict.date}</div>
      <div>
        <Link className="app-navigation-link" to={"/" + dict.author_username}>
          {dict.author_username}
        </Link>
      </div>
    </div>
  );
}
