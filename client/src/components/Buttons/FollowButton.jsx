import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Button } from "reactstrap";
import { follow, unfollow } from "../../actions/friendsActions";
import classNames from "classnames";
function FollowButton(props) {
  const followId = props.followId;
  const [state, setState] = useState("SAME");

  useEffect(() => {
    let isMounted = true;
    if (!followId) return;
    const config = {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": props.token,
      },
    };
    axios
      .get("/api/users/bool/follow/" + followId, config)
      .then((res) => {
        if (isMounted) setState(res.data.answer);
      })
      .catch((err) => console.log(err));

    return () => {
      isMounted = false;
    };
  }, [followId]);

  const handleClick = () => {
    switch (state) {
      case "FOLLOWS_NOT":
        props.follow(followId);
        setState("FOLLOWS");
        return;
      case "FOLLOWS":
        props.unfollow(followId);
        setState("FOLLOWS_NOT");
        return;
      case "SAME":
      default:
        return;
    }
  };

  const text = () => {
    switch (state) {
      case "FOLLOWS":
        return "Unfollow";
      case "FOLLOWS_NOT":
        return "Follow";
      default:
        return;
    }
  };
  return (
    <Fragment>
      {state != "SAME" && (
        <div
          className={classNames("custom-btn", { [state]: true })}
          onClick={handleClick}
        >
          {text()}
        </div>
      )}
    </Fragment>
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
