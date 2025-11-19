import { Col, Container, Image, Row } from 'react-bootstrap';

const Home = () => (
  <main>
    <Container
      id="page-Name"
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: '100vh' }} // full viewport height
    >
      <p className="display-3 fw-bold fade-in">Welcome to TeamUHp</p>

    </Container>
  </main>
);

export default Home;
