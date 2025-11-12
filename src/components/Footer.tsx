'use client';

import { useSession } from 'next-auth/react';
import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;

  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Col className="text-center">
          Team UHp!
          <br />
          University of Hawaii at Manoa
          <br />
          Honolulu, HI 96822
          <br />
          <a href="http://team-uhp.github.io">About Us</a>
          <br />
          <a href="/about-uhp/">About Team UHp!</a>
          <br />
          <a href="/how-to/">How-To Guides</a>
          <br />
          <a href="/contact-us/">Support / Contact Us</a>
          <br />
          {currentUser && role === 'ADMIN' ? (
            <>
              <a href="admin-users/">User Admin</a>
              <br />
              <a href="admin-projects/">Project Admin</a>
              <br />
            </>
          )
            : ''}
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
