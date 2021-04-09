import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { useParams } from "react-router";
import { returnErrors } from "../../actions/errorActions";
import { ClipLoader } from "react-spinners";
function EmailConfirm(props) {
  const [confirmed, setConfirmed] = useState(false);
  const { username, id } = useParams();
  useEffect(() => {
    axios
      .get("/api/users/verify/" + username + "/" + id)
      .then((res) => {})
      .catch((err) => {
        props.returnErrors(
          err.response.data,
          err.response.status,
          "VERIFICATION_FAIL"
        );
      });
  }, [username]);
  return (
    <div>
      <ClipLoader loading={!confirmed} />
      {username}, {id}
    </div>
  );
}

EmailConfirm.propTypes = {
  error: propTypes.object.isRequired,
  returnErrors: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.error,
});

export default connect(mapStateToProps, { returnErrors })(EmailConfirm);
