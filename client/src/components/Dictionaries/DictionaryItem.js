import React from "react";
import { Link } from "react-router-dom";
import Username from "../Render/Username";
import { v4 as uuid } from "uuid";
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
      <div className="">
        <Username key={uuid()} dictId={dict._id} userId={dict.author} />
      </div>
    </div>
  );
}
