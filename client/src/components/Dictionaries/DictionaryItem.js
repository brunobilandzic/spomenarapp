import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import Username from "../Render/Username";
import { v4 as uuid } from "uuid";
export default function DictionaryItem(props) {
  const { dict } = props;
  const match = useRouteMatch();

  return (
    <div className="">
      <div className="">
        <a
          href={`${window.location.origin}/dictionary/${dict._id}`}
          className=""
        >
          {dict.title}
        </a>
      </div>
      <div className="">{dict.description}</div>
      <div className="">{dict.date}</div>
      <div className="">
        <Username key={uuid()} dictId={dict._id} userId={dict.author} />
      </div>
    </div>
  );
}
