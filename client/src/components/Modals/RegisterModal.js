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
import { register } from "../../actions/authActions";
import { returnErrors, clearErrors } from "../../actions/errorActions";

function RegisterModal(props) {
  const [info, setInfo] = useState({
    username: "",
    password: "",
    passwordRepeat: "",
    email: "",
    name: "",
    image: null,
  });
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (props.isAuthenticated && modal) {
      return toggleModal();
    }
  }, [props.isAuthenticated]);

  useEffect(() => {
    if (props.registerSuccess && props.user) {
      setModal(false);
      window.location.href = "/goverify/" + props.user.id;
    }
  }, [props.registerSuccess]);
  function toggleModal() {
    setInfo({
      username: "",
      password: "",
      passwordRepeat: "",
      email: "",
    });
    props.clearErrors();
    setModal(!modal);
  }
  function onSubmit(e) {
    e.preventDefault();
    const newUser = { ...info };
    return props.register(newUser);
  }
  function onChange(e) {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
    if (e.target.name == "passwordRepeat" && info.password != e.target.value) {
      props.returnErrors({
        msg: "Passwords have to match",
        status: -1,
      });
    } else if (e.target.name == "passwordRepeat") {
      props.clearErrors();
    }
  }
  const onChangeImage = (e) => {
    setInfo((i) => ({
      ...i,
      image: e.target.files[0],
    }));
  };
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
              <Label for="email">Email:</Label>
              <Input
                type="email"
                placeholder="Name..."
                onChange={onChange}
                value={info.email}
                name="email"
              />
            </FormGroup>

            <FormGroup>
              <Label for="username">Username:</Label>
              <Input
                type="text"
                placeholder="Enter your username"
                onChange={onChange}
                value={info.username}
                name="username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="image">Profile picture:</Label>
              <Input
                type="file"
                name="image"
                accept=".jpg,.png"
                onChange={onChangeImage}
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
            <FormGroup>
              <Label for="passwordRepeat">Repeat Password:</Label>
              <Input
                type="password"
                placeholder="Repeat Password"
                onChange={onChange}
                value={info.passwordRepeat}
                name="passwordRepeat"
              />
            </FormGroup>
            <div>{props.error.msg.msg}</div>
            <Button className="mr-2" type="submit" color="success">
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
  user: propTypes.object,
  error: propTypes.object.isRequired,
  register: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool,
  registerSuccess: propTypes.bool,
};

const mapStateToProps = (state) => ({
  error: state.error,
  isAuthenticated: state.auth.isAuthenticated,
  registerSuccess: state.auth.registerSuccess,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  clearErrors,
  returnErrors,
  register,
})(RegisterModal);
