import React, { useState } from "react";
import { Input, Button, Label } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { forgotPasswordRequest } from "../../../../actions/authActions";
function PasswordForgot(props) {
  const [user, setUser] = useState("");

  const onChange = (e) => {
    setUser(e.target.value);
  };

  return (
    <div>
      {!props.passwordForgot.emailSent ? (
        <div>
          <Label>Username Or Email</Label>
          <Input
            type="text"
            name="user"
            placeholder="Enter your username or email"
            onChange={onChange}
            value={user}
          />
          <div style={{ height: "2rem" }}>
            {props.error.id != "AUTH_ERROR" && props.error.msg.msg}
          </div>
          <Button
            onClick={() => {
              props.forgotPasswordRequest(user);
            }}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div>
          Email to {props.passwordForgot.email} with instructions to reset your
          password is sent
        </div>
      )}
    </div>
  );
}

PasswordForgot.propTypes = {
  passwordForgot: propTypes.object.isRequired,
  submitUser: propTypes.func.isRequired,
  error: propTypes.object.isRequired,
  forgotPasswordRequest: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.error,
  passwordForgot: state.passwordReset.passwordForgot,
});

export default connect(mapStateToProps, {
  forgotPasswordRequest,
})(PasswordForgot);
