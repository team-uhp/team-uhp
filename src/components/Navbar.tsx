/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowInRight, Lock, Person, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const user = session as { user: { email: string; id: string; randomKey: string } } | null;
  const pathName = usePathname();
  return (
    <Navbar id="Topbar">
      <Container>
      <Navbar.Brand href="/">
          <img
            id="Logo"
            src="/logoMockup.png"
            alt="Site Logo"
            height="50"
          />
      </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav id="TopbarLeft" className="ms-auto">
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
                  <Nav.Link id="sign-out-nav" href="/auth/signout" key="signout" active={pathName === '/auth/signout'}>
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
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <BoxArrowInRight />
                  &nbsp;&nbsp;Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
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
