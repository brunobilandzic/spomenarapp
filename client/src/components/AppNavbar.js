import React, { Fragment, useState } from "react";
import {
  Navbar,
  NavItem,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  Container,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import RegisterModal from "./Modals/RegisterModal";
import LoginModal from "./Modals/LoginModal";
import LogoutButton from "./Modals/LogoutButton";
import { connect } from "react-redux";
import propTypes from "prop-types";
function AppNavbar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const authNavbar = (
    <Fragment>
      <NavItem className="mr-2">
        <Link className="nav-link" to="/new">
          Create Dictionary
        </Link>
      </NavItem>
      <NavItem className="mr-2">
        <Link className="nav-link" to="/profile">
          Profile
        </Link>
      </NavItem>
      <NavItem>
        <LogoutButton />
      </NavItem>
    </Fragment>
  );
  const publicNavbar = (
    <Fragment>
      <NavItem>
        <RegisterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </Fragment>
  );
  return (
    <div>
      <Navbar expand="lg" color="dark" dark className="mb-5">
        <Container>
          <NavbarBrand href="/">Spomenar</NavbarBrand>

          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {props.isAuthenticated ? authNavbar : publicNavbar}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

AppNavbar.propTypes = {
  isAuthenticated: propTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {})(AppNavbar);
