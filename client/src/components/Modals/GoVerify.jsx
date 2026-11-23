import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { useLocation, useParams } from "react-router";
import classNames from "classnames";

function GoVerify(props) {
  const { userId } = useParams();
  const { search } = useLocation();
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(() =>
    new URLSearchParams(search).get("email") === "failed"
      ? "Your account was created, but we couldn't send the verification email. Please try resending."
      : null
  );
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
    setError(null);
    axios
      .get("/api/users/resendverify/" + userId)
      .then(() => {
        setResent(true);
      })
      .catch((err) => setError(err.response?.data?.msg || "Could not resend the verification email."));
  };
  return (
    <div>
      <p>Verify your email address <b>{email}</b> to sign in. Check your inbox and spam folder for the verification link.</p>
      {error && <p role="alert">{error}</p>}
      <hr></hr>
      <div>
        {!resent ? (
          <div className={classNames("custom-btn")} onClick={handleClick}>
            Resend verification link
          </div>
        ) : (
          <div role="status">Verification email sent.</div>
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
