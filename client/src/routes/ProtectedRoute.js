import { connect } from "react-redux";
import propTypes from "prop-types";
import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute(props) {
  return (
    <Route exact path={props.path}>
      {props.isAuthenticated ? <props.component /> : <Redirect to="/" />}
    </Route>
  );
}

ProtectedRoute.propTypes = {
  isAuthenticated: propTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(ProtectedRoute);
