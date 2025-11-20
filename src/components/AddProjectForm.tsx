'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addProject } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddProjectSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import Link from 'next/link';

type ProjectFormValues = {
  image?: string;
  title: string;
  descrip: string;
  duedate?: string;
  members?: (number | undefined)[];
  admins?: (number | undefined)[];
};

const AddProjectForm: React.FC = () => {
  const { status } = useSession();
  const [userId] = useState<number>(0);
  const [selected, setSelected] = useState<Date | undefined>(undefined);

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

  useEffect(() => {
    if (selected) {
      setValue('duedate', selected.toISOString());
    }
  }, [selected, setValue]);

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
    await addProject(projectData);
    swal('Success', 'Your item has been added', 'success', {
      timer: 2000,
    });
    reset();
    setSelected(undefined);
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3" fluid>
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Add Project</h2>
          </Col>
          <Link
            href="/project-list/"
          >
            Back to Project List
          </Link>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <input
                    type="text"
                    {...register('descrip')}
                    className={`form-control ${errors.descrip ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.descrip?.message}</div>
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <DayPicker
                    mode="single"
                    required
                    disabled={{ before: new Date() }}
                    selected={selected}
                    onSelect={setSelected}
                    footer={
                      selected ? `Selected: ${selected.toLocaleDateString()}` : 'Pick a day.'
                    }
                  />
                </Form.Group>
                {errors.duedate && (
                <div className="text-danger mt-2">{errors.duedate.message}</div>
                )}
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
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
