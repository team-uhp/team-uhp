/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowInRight, Lock, Person, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const pathName = usePathname();
  const user = session as { user: { email: string; id: string; randomKey: string } } | null;
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Team UHp!</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser
              ? [
                  <Nav.Link id="home-page-nav" href="/home-page" key="home" active={pathName === '/home-page'}>
                    Home
                  </Nav.Link>,
                  <Nav.Link id="list-project-nav" href="/project-list" key="list" active={pathName === '/project-list'}>
                    Projects List
                  </Nav.Link>,
                  <Nav.Link id="contacts-nav" href="/contacts" key="contacts" active={pathName === '/contacts'}>
                    Contacts
                  </Nav.Link>,
                  <Nav.Link
                    id="helpful-tools-nav"
                    href="/helpful-tools"
                    key="tools"
                    active={pathName === '/helpful-tools'}
                  >
                    Helpful Tools
                  </Nav.Link>,
                  <Nav.Link id="sign-out-nav" href="/signout-page" key="signout" active={pathName === '/signout-page'}>
                    Sign Out
                  </Nav.Link>,
                ]
              : ''}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item
                  id="login-dropdown-profile"
                  href={`/user-profile/${user?.user.id}`}
                >
                  <Person />
                  &nbsp;&nbsp;Profile
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  &nbsp;&nbsp;Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/signin-page">
                  <BoxArrowInRight />
                  &nbsp;&nbsp;Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/signup-page">
                  <PersonPlusFill />
                  &nbsp;&nbsp;Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
