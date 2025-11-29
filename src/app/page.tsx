import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'react-bootstrap';

const Home = () => (
  <main>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Container
        fluid
        className="py-5 text-center"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-40px',
          minHeight: '70vh',
          paddingTop: '100px',
        }}
      >
        <h1 className="display-3 fw-bold fade-in">Welcome to TeamUHp</h1>
        <p className="lead fade-in">Collaborate, manage projects, and grow together.</p>
      <div className="mt-3">
        <Button href="/project-list" variant="primary" className="me-2" 
          style={{ backgroundColor: '#00806D', borderColor: '#00806D' }}>
            View Projects
        </Button>
        <Button href="/project-page/add-project" variant="outline-dark">Create Project</Button>
      </div>
      </Container>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Container className="py-5">
        <h2 className="text-center mb-4">Start Teaming Up!</h2>
        <Row className="g-4 justify-content-center">
          <Col md={4}>
            <Card className="h-100 text-center">
              <CardBody>
                <CardTitle>Grow Experience</CardTitle>
                <CardText>
                  Gain practical experience by working on large scale projects.
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center">
              <CardBody>
                <CardTitle>Collaboration</CardTitle>
                <CardText>
                  Invite collaboration by posting projects, or find projects to join.
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center">
              <CardBody>
                <CardTitle>User Profiles</CardTitle>
                <CardText>
                  Find projects based on your skills and interests, and share your abilities with others.
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Container className="py-5 bg-light" style={{ marginBottom: '80px' }}>
        <h2 className="text-center mb-4">Quick Links</h2>
        <Row className="g-3 justify-content-center">
          <Col md={3} className="text-center">
            <Button href="/helpful-tools" variant="secondary" className="w-100">Helpful Tools</Button>
          </Col>
          <Col md={3} className="text-center">
            <Button href="/contacts" variant="secondary" className="w-100">Contact Us</Button>
          </Col>
          <Col md={3} className="text-center">
            <Button href="/project-list" variant="secondary" className="w-100">Find Projects</Button>
          </Col>
        </Row>
      </Container>
    </div>
  </main>
);

export default Home;
