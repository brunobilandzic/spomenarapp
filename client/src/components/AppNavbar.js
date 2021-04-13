import React, { useState } from "react";
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
export default function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar expand="lg" color="dark" dark className="mb-5">
        <Container>
          <NavbarBrand href="/">Spomenar</NavbarBrand>

          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem className="mr-2">
                <Link className="nav-link" to="/new">
                  Create Dictionary
                </Link>
              </NavItem>
              <NavItem className="mr-2">
                <Link className="nav-link" to="/dictionary/dictid">
                  Dictionary
                </Link>
              </NavItem>
              <NavItem className="mr-2">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </NavItem>
              <NavItem>
                <RegisterModal />
              </NavItem>
              <NavItem>
                <LoginModal />
              </NavItem>
              <NavItem>
                <LogoutButton />
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
