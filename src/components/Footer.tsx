import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
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

      </Row>
    </Container>
  </footer>
);

export default Footer;
