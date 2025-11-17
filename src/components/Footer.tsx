import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer id="Footer" className="mt-auto py-4">
    <Container>
      <Col className="text-align-center">
        <h3><u>About</u></h3>
        <br />
        <a className="footLink" href="https://team-uhp.github.io/#team">About the devs</a>
        <br />
        <br />
        <a className="footLink" href="https://team-uhp.github.io/#overview">About Team-UHp</a>
        <br />
        <br />
      </Col>
    </Container>
  </footer>
);

export default Footer;
