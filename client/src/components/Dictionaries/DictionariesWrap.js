import React, { useState, useEffect } from "react";
import axios from "axios";
import DictionaryItem from "./DictionaryItem";

export default function DictionariesWrap() {
  const [dictionaries, setDictionaries] = useState(null);
  const [dontRun] = useState(null);
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/dicts")
      .then((response) => {
        if (isMounted) setDictionaries([...response.data]);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [dontRun]);

  function renderDictionaries() {
    if (dictionaries === null) {
      return "...Loading";
    }
    return dictionaries.map((dict) => (
      <DictionaryItem key={dict._id} dict={{ ...dict }} />
    ));
  }

  return <div className="dictionaries-wrap">{renderDictionaries()}</div>;
}
