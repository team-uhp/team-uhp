'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addProject } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddProjectSchema } from '@/lib/validationSchemas';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';

type ProjectFormValues = {
  image?: string;
  title: string;
  descrip: string;
  duedate?: string;
  members?: number[];
  admins?: number[];
};

const AddProjectForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<number>(0);
  const [selected, setSelected] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(AddProjectSchema),
    defaultValues: {
      title: '',
      descrip: '',
      duedate: new Date().toISOString(),
      members: [],
      admins: [],
      image: '',
    },
  });

  // Pull userId from session
  useEffect(() => {
    if (session?.user && 'id' in session.user) {
      setUserId(session.user.id as number);
    }
  }, [session]);

  // Sync selected date to RHF form
  useEffect(() => {
    if (selected) setValue('duedate', selected.toISOString());
  }, [selected, setValue]);

  // Set admins + members
  useEffect(() => {
    if (userId > 0) {
      setValue('admins', [userId]);
      setValue('members', [userId]);
    }
  }, [userId, setValue]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!selected) {
      swal('Error', 'Please select a due date', 'error');
      return;
    }

    const projectData = {
      image: data.image || '',
      title: data.title,
      descrip: data.descrip,
      duedate: selected.toISOString(),
      members: [userId],
      admins: [userId],
    };

    try {
      await addProject(projectData);
      swal('Success', 'Your project has been added', 'success', { timer: 2000 });

      reset();
      setSelected(null);
    } catch {
      swal('Error', 'Something went wrong.', 'error');
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Add Project</h2>
          </Col>

          <Link href="/project-list/">Back to Project List</Link>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    {/* Title */}
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <input
                        type="text"
                        {...register('title')}
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.title?.message}</div>
                    </Form.Group>
                  </Col>

                  <Col>
                    {/* Date Picker */}
                    <Form.Group>
                      <br />
                      <Form.Label className="mb-0">Due Date:</Form.Label>
                      <DatePicker
                        selected={selected}
                        onChange={(date) => setSelected(date)}
                        minDate={new Date()}
                        placeholderText="Pick a date"
                        className="form-control"
                      />
                      {errors.duedate && (
                        <div className="text-danger mt-2">{errors.duedate.message}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Description */}
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('descrip')}
                    className={`form-control ${errors.descrip ? 'is-invalid' : ''}`}
                    style={{ height: '120px' }}
                  />
                  <div className="invalid-feedback">{errors.descrip?.message}</div>
                </Form.Group>

                {/* Buttons */}
                <Form.Group>
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={() => {
                          reset();
                          setSelected(null);
                        }}
                        variant="warning"
                        className="float-right"
                      >
                        Reset
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

export default AddProjectForm;
