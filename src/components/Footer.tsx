'use client'

import { useSession } from 'next-auth/react';
import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;

  return (
    <footer id="Footer" className="mt-auto py-1">
      <Container>
        <Row className="justify-content-center text-center">
          <Col xs={3} md={4}>
            <br />
            <u>About</u>
            <br />
            <a className="footLink" href="https://team-uhp.github.io/#team">About the devs</a>
            <br />
            <a className="footLink" href="https://team-uhp.github.io/#overview">About Team-UHp</a>
          </Col>

          <Col xs={12} md={4}>
            <br />
            <u>Help</u>
            <br />
            <a className="footLink" href="https://team-uhp.github.io/#user-guide">User Guide</a>
            <br />
            <a className="footLink" href="https://team-uhp.github.io/">Support/Contact Us</a>
          </Col>

          <Col xs={7} md={4}>
            {currentUser && role === 'ADMIN' ? (
              <>
                <a href="/admin/users">User Admin</a>
                <br />
                <a href="/admin/projects">Project Admin</a>
                <br />
              </>
            )
              : ''}
          </Col>

        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

