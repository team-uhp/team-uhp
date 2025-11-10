'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button, Form, Card } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false, // prevent automatic redirect so we can handle errors
      email,
      password,
      callbackUrl,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push(callbackUrl);
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
                color: 'white',
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#035a40')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#024731')}
            >
              Sign In
            </Button>
          </Form>

          <div
            className="mt-4 text-center"
            style={{
              color: '#024731',
            }}
          >
            <a href="/auth/signup" style={{ color: '#024731', fontWeight: 600 }}>
              Create account
            </a>
            {' '}
            |
            {' '}
            <a href="/forgot-password" style={{ color: '#F8C100', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
