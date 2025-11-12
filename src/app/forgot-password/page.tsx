'use client';

import { Container, Col, Row, Form, Button, Card } from 'react-bootstrap';

const ForgotPassword = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <h1 className="text-center">Forgot Password?</h1>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="form-group">
                  <Form.Label>Email</Form.Label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
