'use client';

import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { changeForgotPassword } from '@/lib/dbActions';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { redirect } from 'next/navigation';

type ChangePasswordForm = {
  password: string;
  confirmPassword: string;
};

type ForgotPasswordFormProps = {
  email: string;
};

export default function ForgotPasswordForm({ email}: ForgotPasswordFormProps) {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Passwords do not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (formData: ChangePasswordForm) => {
    try {
      await changeForgotPassword({
        email,
        password: formData.password,
      });

      await swal('Success!', 'Your password has been changed.', 'success', {
        timer: 2000,
      });

      reset();
      redirect('/auth/signin');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unable to change password.';
      await swal('Error', message, 'error');
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
          width: '450px',
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
            Change Password
          </h1>

          <Form onSubmit={handleSubmit(onSubmit)} className="text-start">

            {/* NEW PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                {...register('password')}
                className={errors.password ? 'is-invalid' : ''}
                style={{ borderColor: '#024731' }}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </Form.Group>

            {/* CONFIRM PASSWORD */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'is-invalid' : ''}
                style={{ borderColor: '#024731' }}
              />
              <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
            </Form.Group>

            {/* BUTTONS */}
            <Row>
              <Col>
                <Button
                  type="submit"
                  style={{
                    backgroundColor: '#024731',
                    borderColor: '#024731',
                    width: '100%',
                    fontWeight: 'bold',
                  }}
                  onMouseOver={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = '#035a40')
                  }
                  onMouseOut={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = '#024731')
                  }
                >
                  Change Password
                </Button>
              </Col>

              <Col>
                <Button
                  type="button"
                  onClick={() => reset()}
                  style={{
                    backgroundColor: '#F8C100',
                    borderColor: '#F8C100',
                    width: '100%',
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                  onMouseOver={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = '#f6d44a')
                  }
                  onMouseOut={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = '#F8C100')
                  }
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
