// add link maybe later
import React, { useState, useEffect } from "react";
import axios from "axios";
export default function Username(props) {
  const { userId, dictId } = props;
  const [author, setAuthor] = useState(null);
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/users/" + userId)
      .then((response) => {
        if (isMounted) setAuthor(response.data);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [userId]);
  return (
    <span className="rendered-username">{author ? author.username : "no"}</span>
  );
}
