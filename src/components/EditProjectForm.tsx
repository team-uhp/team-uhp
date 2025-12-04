'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { editProject } from '@/lib/dbActions';
import { EditProjectSchema } from '@/lib/validationSchemas';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MemberToggle from './MemberToggle';

type EditProjectFormValues = {
  id: number;
  image?: string;
  title: string;
  descrip: string;
  duedate: string;
  members?: number[];
  admins?: number[];
};

type EditProjectFormProps = {
  proj: {
    id: number;
    image?: string;
    title: string;
    descrip: string;
    duedate: string;
  },
  members: { id: number; name: string; image?: string }[],
  admins: { id: number; name: string }[],
};

const EditProjectForm: React.FC<EditProjectFormProps> = ({ proj, members, admins }) => {
  const [selected, setSelected] = useState<Date | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditProjectFormValues>({
    resolver: yupResolver(EditProjectSchema) as unknown as Resolver<EditProjectFormValues>,
    defaultValues: {
      id: proj.id,
      title: proj.title,
      descrip: proj.descrip,
      duedate: proj.duedate || undefined,
      image: proj.image || undefined,
      members: members?.map((m) => m.id) || undefined,
      admins: admins?.map((a) => a.id) || undefined,
    },
  });

  // Sync selected date to RHF form
  useEffect(() => {
    if (selected) setValue('duedate', selected.toISOString());
  }, [selected, setValue]);

  // Initialize selected date from project
  useEffect(() => {
    if (proj?.duedate) {
      setSelected(new Date(proj.duedate));
    }
  }, [proj?.duedate]);

  const onSubmit = async (data: EditProjectFormValues) => {
    if (!selected) {
      swal('Error', 'Please select a due date', 'error');
      return;
    }

    const projectData = {
      id: data.id,
      image: data.image || '',
      title: data.title,
      descrip: data.descrip,
      duedate: selected.toISOString(),
      positions: [],
      members: data.members || [],
      admins: data.admins || [],
    };

    try {
      if (members.length === 0 || admins.length === 0) throw new Error('At least one member and admin must be assigned');
      
      await editProject(projectData);
      swal('Success', 'Your project has been added', 'success', { timer: 2000 });

      reset();
      router.push('/project-list');
    } catch {
      swal('Error', 'Something went wrong.', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Edit Project</h2>
          </Col>

          <Link href="/project-list/">Back to Project List</Link>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
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

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('descrip')}
                    className={`form-control ${errors.descrip ? 'is-invalid' : ''}`}
                    style={{ height: '120px' }}
                  />
                  <div className="invalid-feedback">{errors.descrip?.message}</div>
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Members (Uncheck to remove)</Form.Label>
                    <div style={{ marginTop: '0.5rem' }}>
                      {Array.isArray(members) && members.length > 0 ? (
                        members.map((tag) => (
                          <MemberToggle key={tag.id} name={tag.name} />
                        ))
                      ) : (
                        <div>No members listed.</div>
                      )}
                    </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Admins (Check to give admin role)</Form.Label>
                    <div style={{ marginTop: '0.5rem' }}>
                      {Array.isArray(members) && members.length > 0 ? (
                        members.map((tag) => (
                          <MemberToggle key={tag.id} name={tag.name} />
                        ))
                      ) : (
                        <div>No admins listed.</div>
                      )}
                    </div>
                </Form.Group>

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

export default EditProjectForm;
