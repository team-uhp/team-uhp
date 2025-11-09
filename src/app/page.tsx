import { Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col position="middle">
          <p className="display-3 fw-bold fade-in">Welcome to TeamUHp</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
