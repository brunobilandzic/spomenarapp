import React, { Fragment } from "react";
import { NavLink } from "reactstrap";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { logout } from "../../actions/authActions";

function LogoutButton(props) {
  return (
    <Fragment>
      <NavLink href="#" onClick={props.logout}>
        Logout
      </NavLink>
    </Fragment>
  );
}

LogoutButton.propTypes = {
  logout: propTypes.func.isRequired,
};

export default connect(null, { logout })(LogoutButton);
