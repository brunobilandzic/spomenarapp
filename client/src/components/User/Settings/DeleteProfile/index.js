import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { Label, Input, Button } from "reactstrap";
import { grantDeletion, deleteProfile } from "../../../../actions/authActions";
function DeleteProfile(props) {
  const [password, setPassword] = useState("");

  const onChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      {!props.grantProfileDeletion ? (
        <div>
          <Label>Enter Your Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={onChange}
            value={password}
          />
          <div style={{ height: "2rem" }}>{props.error.msg.msg}</div>
          <Button
            onClick={() => {
              props.grantDeletion(password);
              setPassword("");
            }}
          >
            Submit
          </Button>
        </div>
      ) : !props.profileDeleted ? (
        <Button
          color="danger"
          className="btn-lg mx-auto"
          onClick={props.deleteProfile}
        >
          Delete Profile
        </Button>
      ) : (
        <div>
          You have deleted your profile, hope we see you come back soon :)
        </div>
      )}
    </div>
  );
}

DeleteProfile.propTypes = {
  user: propTypes.object,
  grantDeletion: propTypes.func.isRequired,
  deleteProfile: propTypes.func.isRequired,
  grantProfileDeletion: propTypes.bool,
  error: propTypes.object.isRequired,
  profileDeleted: propTypes.bool,
};

const mapStateToProps = (state) => ({
  grantProfileDeletion: state.passwordReset.grantProfileDeletion,
  user: state.auth.user,
  error: state.error,
  profileDeleted: state.passwordReset.profileDeleted,
});
export default connect(mapStateToProps, { deleteProfile, grantDeletion })(
  DeleteProfile
);
