'use client';

import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

// Validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setServerError(null);

    try {
      // call the existing createUser from dbActions
      await createUser({
        email: data.email,
        password: data.password,
      });

      // If it doesn't throw, assume success
      setSuccess(true);
      reset();

      // Redirect after short delay
      setTimeout(() => router.push('/auth/signin'), 1500);
    } catch (err: any) {
      console.error('Signup error:', err);
      setServerError(err.message || 'Failed to create account. ');
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

          <Form className="text-start" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register('email')}
                style={{ borderColor: '#024731' }}
              />
              <div className="text-danger small">{errors.email?.message}</div>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                {...register('password')}
                style={{ borderColor: '#024731' }}
              />
              <div className="text-danger small">{errors.password?.message}</div>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                {...register('confirmPassword')}
                style={{ borderColor: '#024731' }}
              />
              <div className="text-danger small">
                {errors.confirmPassword?.message}
              </div>
            </Form.Group>

            {/* Server messages */}
            {serverError && (
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                {serverError}
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

          <div className="mt-4 text-center" style={{ color: '#024731' }}>
            <a href="/auth/signin" style={{ color: '#F8C100', fontWeight: 600 }}>
              Already have an account? Sign In
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
