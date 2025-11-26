'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;

  return (
    <footer id="Footer" className="mt-auto py-3">
      <Container>
        <Row>
          <Col> 
            <strong>Navigate</strong>
            <hr />
            <a className="footLink" href=""> 
              {/* TO DO: Add appropriate links to href. Intended for project finders*/}
              Find Projects
            </a>
            <a className="footLink" href=""> 
              {/* TO DO: Add appropriate links to href. Intended for project owners*/}
              Post Projects
            </a>
            <a className="footLink" href="/contacts">
              Contacts
            </a>
          </Col>

          <Col>
            <strong>About</strong>
            <hr />
            <a className="footLink" href="https://team-uhp.github.io/#team">
              About the Team
            </a>
            <a className="footLink" href="https://team-uhp.github.io/#overview">
              About TeamUHp
            </a>
          </Col>

          <Col>
            <strong>Resources</strong>
            <hr />
            <a className="footLink" href="https://team-uhp.github.io/#user-guide">
              User Guide
            </a>
            <a className="footLink" href="https://team-uhp.github.io/">
              Contact Us
            </a>
          </Col>

          {currentUser && role === 'ADMIN' && (
            <Col>
              <strong>Admin</strong>
              <hr />
              <a className="footLink" href="/admin/users">
                User Admin
              </a>
              <a className="footLink" href="/admin/projects">
                Project Admin
              </a>
            </Col>
          )}
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

