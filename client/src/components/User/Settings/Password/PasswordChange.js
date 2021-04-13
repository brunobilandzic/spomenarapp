import React, { useState } from "react";
import { Input, Button, Label } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import {
  passResetAuthRequest,
  submitNewPassword,
} from "../../../../actions/authActions";
import SetNewPassword from "./SetNewPassword";
function PasswordChange(props) {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  });
  const [newPasswordReceived, setNewPasswordReceived] = useState(false);
  const submitOldPassword = (e) => {
    if (!props.user) {
      console.log("User not loaded");
      return -1;
    }
    props.passResetAuthRequest(passwords.oldPassword);
  };

  const submitNewPassword = () => {
    const { newPassword } = passwords;
    if (newPassword.length < 6) {
      return;
    }
    setNewPasswordReceived(true);
  };
  const submitNewPasswordRepeat = () => {
    const { newPassword, newPasswordRepeat } = passwords;
    if (newPasswordRepeat != newPassword) return handleBack();
    props.submitNewPassword(passwords.newPassword);
  };

  const handleBack = () => {
    setPasswords({
      ...passwords,
      newPassword: "",
      newPasswordRepeat: "",
    });
    setNewPasswordReceived(false);
  };
  const onChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {!props.passResetAuth && !props.passResetSuccess ? (
        <div>
          <Label>Enter Your Password</Label>
          <Input
            type="password"
            name="oldPassword"
            placeholder="Enter your old password"
            onChange={onChange}
            value={passwords.oldPassword}
          />
          <div style={{ height: "2rem" }}>
            {props.error.id != "AUTH_ERROR" && props.error.msg.msg}
          </div>
          <Button onClick={submitOldPassword}>Submit</Button>
        </div>
      ) : (
        <SetNewPassword />
      )}
    </div>
  );
}

PasswordChange.propTypes = {
  user: propTypes.object,
  passResetAuth: propTypes.bool,
  passResetAuthRequest: propTypes.func.isRequired,
  error: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  passResetAuth: state.passwordReset.passResetAuth,
  passResetSuccess: state.passwordReset.passResetSuccess,
  error: state.error,
});

export default connect(mapStateToProps, {
  passResetAuthRequest,
})(PasswordChange);
