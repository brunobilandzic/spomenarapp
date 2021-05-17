import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { useParams } from "react-router";
import classNames from "classnames";

function GoVerify(props) {
  const { userId } = useParams();
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;
    axios
      .get("/api/users/email/" + userId)
      .then((response) => {
        if (isMounted) setEmail(response.data.email);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleClick = () => {
    axios
      .get("/api/users/resendverify/" + userId)
      .then((res) => {
        setResent(true);
      })
      .catch((err) => setError(err.message));
  };
  return (
    <div>
      <p>
        We've sent you an email on <b>{email}</b>.<br></br>
        In order to be able to log in into the app, please click on the link
        we've sent in your inbox.
        <br />
        <br />
        <i>
          If you dont see the email in your inbox, please check spam folder.
        </i>
      </p>
      <hr></hr>
      <div>
        {!resent ? (
          <div className={classNames("custom-btn")} onClick={handleClick}>
            Resend verification link
          </div>
        ) : (
          <div>Email sent, if you come across more problems please contact</div>
        )}
      </div>
    </div>
  );
}
GoVerify.propTypes = {
  user: propTypes.object,
  registerSuccess: propTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  registerSuccess: state.auth.registerSuccess,
});

export default connect(mapStateToProps, {})(GoVerify);
