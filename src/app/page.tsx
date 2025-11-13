import { Container } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container
      id="page-Name"
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-center"
    >
      <p className="display-3 fw-bold fade-in">Welcome to TeamUHp</p>
    </Container>
  </main>
);

export default Home;
