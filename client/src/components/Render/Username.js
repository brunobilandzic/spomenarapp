// add link maybe later
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
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
    <div>
      {author ? (
        <Link class="app-navigation-link" to={"/" + author.username}>
          {author.username}
        </Link>
      ) : (
        <ClipLoader size="1rem"></ClipLoader>
      )}
    </div>
  );
}
