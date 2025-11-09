import { Navbar, Nav, Container } from 'react-bootstrap';
import { Search, PersonFill, CartFill } from 'react-bootstrap-icons';

function Header() {
  return (
    <header>
      <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          {/* Left: Tabs */}
          <Nav className="me-auto gap-2">
            <Nav.Link href="#">SUPPLEMENTS</Nav.Link>
            <Nav.Link href="#">ENERGY DRINKS</Nav.Link>
            <Nav.Link href="#">INSIDE RYSE</Nav.Link>
            <Nav.Link href="#">STACK & SAVE</Nav.Link>
            <Nav.Link href="#">FIND NEAR YOU</Nav.Link>
          </Nav>

          {/* Right: Icons */}
          <Nav className="ms-auto d-flex align-items-center gap-2">
            <Nav.Link href="#"><Search /></Nav.Link>
            <Nav.Link href="#"><PersonFill /></Nav.Link>
            <Nav.Link href="#"><CartFill /></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}
export default Header;
