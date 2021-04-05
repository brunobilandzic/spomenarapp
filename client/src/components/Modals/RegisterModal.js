import React, { useState, Fragment } from "react";
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
import { register } from "../../actions/authActions";
import { returnErrors, clearErrors } from "../../actions/errorActions";
function RegisterModal(props) {
  const [info, setInfo] = useState({
    username: "",
    password: "",
    passwordRepeat: "",
    email: "",
    name: "",
  });
  const [modal, setModal] = useState(false);
  function toggleModal() {
    setInfo({
      username: "",
      password: "",
      passwordRepeat: "",
      email: "",
      name: "",
    });
    props.clearErrors();
    setModal(!modal);
  }
  function onSubmit() {
    if (info.password != info.passwordRepeat) {
      props.returnErrors({
        msg: "Passwords have to match",
        status: -1,
      });
    }
  }
  function onChange(e) {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
    if (e.target.name == "passwordRepeat") {
      props.returnErrors({
        msg: "Passwords have to match",
        status: -1,
      });
    }
  }
  return (
    <Fragment>
      <NavLink href="#" onClick={toggleModal}>
        Register
      </NavLink>
      <Modal toggle={toggleModal} isOpen={modal}>
        <ModalHeader toggle={toggleModal}>Register</ModalHeader>
        <ModalBody>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="name">Name:</Label>
              <Input
                type="text"
                placeholder="Name..."
                onChange={onChange}
                value={info.name}
                name="name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="username">Username:</Label>
              <Input
                type="text"
                placeholder="username..."
                onChange={onChange}
                value={info.username}
                name="username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password:</Label>
              <Input
                type="password"
                onChange={onChange}
                value={info.password}
                name="password"
              />
            </FormGroup>
            <FormGroup>
              <Label for="passwordRepeat">Repeat Password:</Label>
              <Input
                type="password"
                onChange={onChange}
                value={info.passwordRepeat}
                name="passwordRepeat"
              />
            </FormGroup>
            <div>{props.error.msg.msg}</div>
            <Button type="submit" color="success">
              Register
            </Button>
            <Button onClick={toggleModal}>Cancel</Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

RegisterModal.propTypes = {
  clearErrors: propTypes.func.isRequired,
  returnErrors: propTypes.func.isRequired,
  error: propTypes.object.isRequired,
  register: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.error,
});

export default connect(mapStateToProps, {
  clearErrors,
  returnErrors,
  register,
})(RegisterModal);
