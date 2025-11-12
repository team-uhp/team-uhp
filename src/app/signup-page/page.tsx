'use client';

import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/signin-page'), 1500);
      } else {
        const data = await res.json();
        setError(data.message || 'Sign up failed.');
      }
    } catch (err) {
      setError('An error occurred while creating your account.');
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
            UH Mānoa Sign Up
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

            <Form.Group className="mb-3">
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

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ borderColor: '#024731' }}
                required
              />
            </Form.Group>

            {error && (
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </p>
            )}
            {success && (
              <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>
                Account created! Redirecting…
              </p>
            )}

            <Button
              type="submit"
              style={{
                backgroundColor: '#024731',
                borderColor: '#024731',
                width: '100%',
                fontWeight: 'bold',
                color: 'white',
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#035a40')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#024731')}
            >
              Sign Up
            </Button>
          </Form>

          <div
            className="mt-4 text-center"
            style={{
              color: '#024731',
            }}
          >
            <a href="/signin-page" style={{ color: '#F8C100', fontWeight: 600 }}>
              Already have an account? Sign In
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
