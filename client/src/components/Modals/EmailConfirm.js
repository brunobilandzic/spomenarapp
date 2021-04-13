import axios from "axios";
import React, { useState, useEffect } from "react";
import { verifyEmail } from "../../actions/authActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { useParams } from "react-router";
import { returnErrors } from "../../actions/errorActions";
import { ClipLoader } from "react-spinners";
function EmailConfirm(props) {
  const [confirmed, setConfirmed] = useState(false);
  const { username, id } = useParams();
  useEffect(() => {
    props.verifyEmail(username, id);
  }, [username]);

  useEffect(() => {
    if (props.user && props.user.verified) setConfirmed(true);
  }, [props.user]);
  return (
    <div>
      {!confirmed ? (
        <div>
          <ClipLoader loading={!confirmed} />
          {username}, {id}
        </div>
      ) : (
        <div>Email verified!</div>
      )}
    </div>
  );
}

EmailConfirm.propTypes = {
  error: propTypes.object.isRequired,
  returnErrors: propTypes.func.isRequired,
  user: propTypes.object,
  verifyEmail: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.error,
  user: state.auth.user,
});

export default connect(mapStateToProps, { returnErrors, verifyEmail })(
  EmailConfirm
);
