'use client';

import { forgotPasswordEmail } from '@/lib/dbActions';
import React, { useState } from 'react';
import { Container, Col, Row, Form, Button, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [submitted, setSubmitted] = useState(false);

  type ForgotPasswordForm = {
    email: string;
  };

  const onSubmit = (data: ForgotPasswordForm) => {
    console.log(data);
    setSubmitted(true);
    forgotPasswordEmail(data.email);
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '50vh' }}
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
                    Forgot Password?
                  </h1>
                  <p
                    style={{
                      color: '#000000',
                      textAlign: 'left',
                    }}
                  >
                    Enter the UH email address associated with your account to reset your password.
                  </p>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="form-group">
                      <Form.Label style={{ color: '#024731', fontWeight: 600 }}>Email</Form.Label>
                      <input
                        style={{ borderColor: '#024731' }}
                        placeholder="Enter email"
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
                        Reset Password
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
                    Instructions have been sent to reset your password at the email address you provided.
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
