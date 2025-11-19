'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    });

    if (result?.error) {
      setError('Invalid email or password, or account not verified');
    } else {
      router.push('/');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Card
        style={{
          width: '420px',
          border: '2px solid #024731',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          borderRadius: '1rem',
        }}
      >
        <Card.Body>
          <h1
            style={{
              color: '#024731',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
            }}
          >
            UH Mānoa Sign In
          </h1>

          <Form className="text-start" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderColor: '#024731' }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderColor: '#024731' }}
                required
              />
            </Form.Group>

            {error && (
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              style={{
                backgroundColor: '#024731',
                borderColor: '#024731',
                width: '100%',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#035a40')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#024731')}
            >
              Sign In
            </Button>
          </Form>

          <Row style={{ marginTop: '10px' }}>
            <Col>
              <div className="mt-4 text-center" style={{ color: '#024731' }}>
                <a href="/auth/signup" style={{ color: '#024731', fontWeight: 600 }}>
                  Create account
                </a>
                {' '}
              </div>
            </Col>
            <Col>
              <Row>
                <Col xs="auto" className="d-flex justify-content-center">
                  <div
                    style={{
                      width: '2px',
                      backgroundColor: '#024731',
                      height: '55px',
                      marginTop: '15px',
                    }}
                  />
                </Col>
                <Col className="text-start" style={{ marginTop: '10px' }}>
                  <div>
                    <a href="/auth/forgot-password" style={{ color: '#F8C100', fontWeight: 500 }}>
                      Forgot Password?
                    </a>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href="/auth/forgot-username" style={{ color: '#F8C100', fontWeight: 500 }}>
                      Forgot Username?
                    </a>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
