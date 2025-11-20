'use client';

import React from 'react';
import { useState } from 'react';
import { Container, Col, Row, Form, Button, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function ForgotUsername() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotUsernameForm>();
  const [submitted, setSubmitted] = useState(false);

  type ForgotUsernameForm = {
    email: string;
  };

  const onSubmit = (data: ForgotUsernameForm) => {
    console.log(data);
    setSubmitted(true);
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '70vh' }}
    >
      <Row className="justify-content-center">
        <Col>
          <Card
            style={{
              width: '500px',
              border: '2px solid #024731',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              borderRadius: '1rem',
            }}
          >
            <Card.Body style={{ padding: '2rem' }}>
              {!submitted && (
                <>
                  <h1
                    style={{
                      color: '#024731',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Forgot Username?
                  </h1>
                  <p
                    style={{
                      color: '#000000',
                      textAlign: 'left',
                    }}
                  >
                    Enter the UH email address associated with your account to find your username.
                  </p>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="form-group">
                      <Form.Label style={{ color: '#024731', fontWeight: 600 }}>Email</Form.Label>
                      <input
                        style={{ borderColor: '#024731' }}
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      />
                    </Form.Group>
                    <div className="text-center" style={{ marginTop: '1.5rem' }}>
                      <Button
                        type="submit"
                        style={{
                          backgroundColor: '#024731',
                          borderColor: '#024731',
                          width: '60%',
                          fontWeight: 'bold',
                        }}
                        onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#035a40')}
                        onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#024731')}
                      >
                        Find Username
                      </Button>
                    </div>
                  </Form>
                </>
              )}

              {submitted && (
                <div className="text-center" style={{ padding: '2rem' }}>
                  <h3 style={{ color: '#024731', fontWeight: 'bold', paddingBottom: '1rem' }}>
                    Please Check Your Email
                  </h3>
                  <p style={{ paddingBottom: '0.5rem' }}>
                    Your account details have been sent to the email address you provided.
                  </p>
                  <a
                    href="/auth/signin"
                    style={{ color: '#024731', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    &lt; Return to Sign In
                  </a>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
