'use client';

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { applyCreate } from '@/lib/dbActions';
import { ApplyPositionSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Position } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';

type ApplyOpeningFormValues = {
  userId: number;
  positionId: number;
  application?: string;
};

type ApplyOpeningFormProps = {
  position: Position;
};

const ApplyOpeningForm: React.FC<ApplyOpeningFormProps> = ({ position }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplyOpeningFormValues>({
    resolver: yupResolver(ApplyPositionSchema) as unknown as Resolver<ApplyOpeningFormValues>,
    defaultValues: {
      userId: 0,
      positionId: position.id,
      application: '',
    },
  });

  useEffect(() => {
    if (session?.user && 'id' in session.user) {
      setUserId(session.user.id as number);
    }
  }, [session]);

  useEffect(() => {
    setValue('userId', userId);
  }, [userId, setValue]);

  const onSubmit: SubmitHandler<ApplyOpeningFormValues> = async (data) => {
    setIsSubmitting(true);

    const appdata = {
      userId: Number(userId),
      positionId: position.id,
      application: data.application || '',
    };

    console.log('Submitting application data:', appdata);

    try {
      await applyCreate(appdata);
      await swal('Success', 'Your application has been submitted', 'success', {
        timer: 2000,
      });
      reset();
      router.push(`/project-opening/${position.id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return;
      }
      await swal('Error', 'Your application was not submitted', 'error', {
        timer: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Link
            href={`/project-opening/${position.id}`}
            style={{ marginBottom: '12px', display: 'inline-block', color: '#111613' }}
          >
            Back to Opening
          </Link>
          <Card style={{ marginBottom: '80px' }}>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Application Text</Form.Label>
                  <textarea
                    {...register('application')}
                    style={{ height: '200px' }} 
                    className={`form-control ${errors.application ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.application?.message}</div>
                </Form.Group>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" id="application-submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplyOpeningForm;
