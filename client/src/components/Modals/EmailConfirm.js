import axios from "axios";
import React from "react";
import { useParams } from "react-router";

export default function EmailConfirm() {
  const [confirmed, setConfirmed] = useState(false);
  const { username, hash } = useParams();

  return <div>{(username, hash)}</div>;
}
