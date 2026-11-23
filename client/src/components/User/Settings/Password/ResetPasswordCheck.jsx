import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkEmailLink, updateHash } from "../../../../actions/authActions";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import SetNewPassword from "./SetNewPassword";
function ResetPasswordCheck(props) {
  const { username, hash } = useParams();
  const { linkVerified } = props.passwordForgot;
  useEffect(() => {
    props.checkEmailLink(username, hash);
    props.updateHash(hash);
  }, [username]);

  return <div>{!linkVerified ? <ClipLoader /> : <SetNewPassword />}</div>;
}

ResetPasswordCheck.propTypes = {
  passwordForgot: propTypes.object.isRequired,
  checkEmailLink: propTypes.func.isRequired,
  updateHash: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  passwordForgot: state.passwordReset.passwordForgot,
});

export default connect(mapStateToProps, { checkEmailLink, updateHash })(
  ResetPasswordCheck
);
