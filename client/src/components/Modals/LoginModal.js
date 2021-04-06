import React, { useState, Fragment, useEffect } from "react";
import {
  Form,
  Button,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  NavLink,
  Label,
  Input,
} from "reactstrap";

import { connect } from "react-redux";
import propTypes from "prop-types";
import { login } from "../../actions/authActions";
import { returnErrors, clearErrors } from "../../actions/errorActions";

function LoginModal(props) {
  const [info, setInfo] = useState({
    user: "",
    password: "",
  });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (props.isAuthenticated && modal) {
      return toggleModal();
    }
  }, [props.isAuthenticated]);

  function toggleModal() {
    setInfo({
      user: "",
      password: "",
    });
    props.clearErrors();
    setModal(!modal);
  }
  function onSubmit(e) {
    e.preventDefault();
    props.clearErrors();
    const credentials = { ...info };
    return props.login(credentials);
  }
  function onChange(e) {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <Fragment>
      <NavLink href="#" onClick={toggleModal}>
        Login
      </NavLink>
      <Modal toggle={toggleModal} isOpen={modal}>
        <ModalHeader toggle={toggleModal}>Login</ModalHeader>
        <ModalBody>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="email">Username or email:</Label>
              <Input
                type="text"
                placeholder="Enter your username or email"
                onChange={onChange}
                value={info.user}
                name="user"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password:</Label>
              <Input
                type="password"
                placeholder="Password"
                onChange={onChange}
                value={info.password}
                name="password"
              />
            </FormGroup>
            <div style={{ height: "2rem" }}>{props.error.msg.msg}</div>
            <Button className="mr-2" type="submit" color="success">
              Login
            </Button>
            <Button onClick={toggleModal}>Cancel</Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

LoginModal.propTypes = {
  clearErrors: propTypes.func.isRequired,
  returnErrors: propTypes.func.isRequired,
  error: propTypes.object.isRequired,
  login: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool,
};

const mapStateToProps = (state) => ({
  error: state.error,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  clearErrors,
  returnErrors,
  login,
})(LoginModal);
