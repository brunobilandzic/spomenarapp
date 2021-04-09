import React, { useState } from "react";
import { Input, Button, Label } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { submitNewPassword } from "../../../../actions/authActions";
function SetNewPassword(props) {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    newPasswordRepeat: "",
  });
  const [newPasswordReceived, setNewPasswordReceived] = useState(false);

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
      {!newPasswordReceived ? (
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
      ) : !props.passResetSuccess ? (
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
      ) : (
        <div>Password reset successfull.</div>
      )}
    </div>
  );
}

SetNewPassword.propTypes = {
  submitNewPassword: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  passResetAuth: state.passwordReset.passResetAuth,
  passResetSuccess: state.passwordReset.passResetSuccess,
});

export default connect(mapStateToProps, {
  submitNewPassword,
})(SetNewPassword);
