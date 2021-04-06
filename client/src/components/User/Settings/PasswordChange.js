import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Label } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import {
  passResetAuthRequest,
  submitNewPassword,
} from "../../../actions/authActions";
import { clearErrors } from "../../../actions/errorActions";
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
      {!props.passResetAuth && (
        <div>
          <Label>Enter Your Password</Label>
          <Input
            type="password"
            name="oldPassword"
            placeholder="Enter your old password"
            onChange={onChange}
            value={passwords.oldPassword}
          />
          <div style={{ height: "2rem" }}>{props.error.msg.msg}</div>
          <Button onClick={submitOldPassword}>Submit</Button>
        </div>
      )}
      {props.passResetAuth && !newPasswordReceived && (
        <div>
          <Label>Enter Your New Password</Label>
          <Input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            onChange={onChange}
            value={passwords.newPassword}
          />
          <div style={{ height: "2rem" }}>
            {passwords.newPassword.length != 0 &&
              passwords.newPassword.length < 6 && (
                <span>Password has to be at least 6 characters long!</span>
              )}
          </div>
          <Button onClick={submitNewPassword}>Next</Button>
        </div>
      )}
      {props.passResetAuth && newPasswordReceived && (
        <div>
          <Label>Reaeat Your New Password</Label>
          <Input
            type="password"
            name="newPasswordRepeat"
            placeholder="Repeat your new password"
            onChange={onChange}
            value={passwords.newPasswordRepeat}
          />
          <div style={{ height: "2rem" }}></div>
          {passwords.newPassword != passwords.newPasswordRepeat ? (
            <Button onClick={handleBack}>Back</Button>
          ) : (
            <Button onClick={submitNewPasswordRepeat}>Ok</Button>
          )}
        </div>
      )}
    </div>
  );
}

PasswordChange.propTypes = {
  user: propTypes.object,
  passResetAuth: propTypes.bool,
  passResetAuthRequest: propTypes.func.isRequired,
  error: propTypes.object.isRequired,
  submitNewPassword: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  passResetAuth: state.passwordReset.passResetAuth,
  error: state.error,
});

export default connect(mapStateToProps, {
  passResetAuthRequest,
  submitNewPassword,
})(PasswordChange);
