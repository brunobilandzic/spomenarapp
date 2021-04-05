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
                <Link className="nav-link" to="/third">
                  Third
                </Link>
              </NavItem>
              <NavItem>
                <RegisterModal />
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
