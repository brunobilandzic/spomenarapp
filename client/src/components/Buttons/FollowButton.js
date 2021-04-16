import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Button } from "reactstrap";
import { follow, unfollow } from "../../actions/friendsActions";
function FollowButton(props) {
  const followId = props.followId;
  const [state, setState] = useState("Loading");

  useEffect(() => {
    let isMounted = true;
    const config = {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": props.token,
      },
    };
    const body = { followId };
    console.log(body, "\n", config);
    axios
      .get("/api/users/bool/follow/" + followId, config)
      .then((res) => {
        res.data && isMounted ? setState("Unfollow") : setState("Follow");
      })
      .catch((err) => console.log(err));

    return () => {
      isMounted = false;
    };
  }, [followId]);

  const handleClick = () => {
    switch (state) {
      case "Loading":
        return;
      case "Follow":
        props.follow(followId);
        setState("Unfollow");
        return;
      case "Unfollow":
        props.unfollow(followId);
        setState("Follow");
        return;
      default:
        return;
    }
  };
  return (
    <div>
      <Button onClick={handleClick}>
        {state == "Loading" ? <ClipLoader size="1rem" /> : state}
      </Button>
    </div>
  );
}

FollowButton.propTypes = {
  user: propTypes.object,
  isAuthenticated: propTypes.bool,
  token: propTypes.string.isRequired,
  follow: propTypes.func.isRequired,
  unfollow: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token,
});

export default connect(mapStateToProps, { follow, unfollow })(FollowButton);
