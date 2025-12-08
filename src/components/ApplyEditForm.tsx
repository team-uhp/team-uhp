'use client';

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { applyEdit } from '@/lib/dbActions';
import { ApplyEditSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import { Application } from '@prisma/client';

type ApplyEditFormValues = {
  application?: string;
  id?: number;
};

type ApplyEditFormProps = {
  applic: Application;
};

const ApplyEditForm: React.FC<ApplyEditFormProps> = ({ applic }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyEditFormValues>({
    resolver: yupResolver(ApplyEditSchema) as unknown as Resolver<ApplyEditFormValues>,
    defaultValues: {
      id: applic.id,
      application: applic.application || '',
    },
  });

  useEffect(() => {
    if (session?.user && 'id' in session.user) {
      setUserId(session.user.id as number);
    }
  }, [session]);

  const onSubmit: SubmitHandler<ApplyEditFormValues> = async (data) => {
    setIsSubmitting(true);

    const appdata = {
      id: applic.id,
      application: data.application || '',
    };

    console.log('Editing application data:', appdata);

    try {
      await applyEdit(appdata);
      await swal('Success', 'Your position has been edited', 'success', {
        timer: 2000,
      });
      reset();
      router.push(`/project-opening/${applic.positionId}`);
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

  console.log('Errors:', errors);
  console.log('userId', userId);
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Link
            href={`/project-opening/${applic.positionId}`}
            style={{ marginBottom: '12px', display: 'inline-block' }}
          >
            Back to Opening
          </Link>
          <Card>
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
                      <Button type="submit" variant="primary" disabled={isSubmitting} id="application-submit">
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

export default ApplyEditForm;
