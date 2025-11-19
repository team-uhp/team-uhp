'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Card, Col, Button, Form, Row } from 'react-bootstrap';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import React from 'react';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';

  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Old password is required'),
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
    if (!email) {
      await swal('Not signed in', 'Please sign in to change your password.', 'error');
      return;
    }

    try {
      await changePassword({
        email,
        oldpassword: formData.oldpassword,
        password: formData.password,
      });

      await swal('Success!', 'Your password has been changed.', 'success', {
        timer: 2000,
      });

      reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await swal('Error', err.message || 'Unable to change password.', 'error');
    }
  };

  if (status === 'loading') return <LoadingSpinner />;

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

            {/* OLD PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#024731', fontWeight: 600 }}>
                Old Password
              </Form.Label>
              <Form.Control
                type="password"
                {...register('oldpassword')}
                className={errors.oldpassword ? 'is-invalid' : ''}
                style={{ borderColor: '#024731' }}
              />
              <div className="invalid-feedback">{errors.oldpassword?.message}</div>
            </Form.Group>

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
