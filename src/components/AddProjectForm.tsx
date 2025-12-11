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
import { useRouter } from 'next/navigation';

type ProjectFormValues = {
  image?: string;
  title: string;
  descrip: string;
  duedate?: string;
  members: number[];
  admins: number[];
};

const AddProjectForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<number>(0);
  const [selected, setSelected] = useState<Date | null>(null);
  const [imgPre, setImgPre] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [img, setImg] = useState<File | null>(null);
  const router = useRouter();

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

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      swal('Error', 'Image must be .jpg, .png, .webp, or .gif', 'error');
      return;
    }

    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      swal('Error', 'Image size must be under 4MB', 'error');
      return;
    }

    setImg(file);

    const read = new FileReader();
    read.onloadend = () => {
      const base64Image = read.result as string;
      if (!base64Image.startsWith('data:image/')) {
        swal('Error', 'Invalid image format', 'error');
        return;
      }

      setImgPre(base64Image);
      setValue('image', base64Image);
    };

    read.readAsDataURL(file);
  }

  const handleImgDel = () => {
    setImg(null);
    setImgPre(null);
    setValue('image', '');
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if(input) input.value = '';
  };

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
      handleImgDel();
      router.push('/project-list');
    } catch {
      swal('Error', 'Something went wrong.', 'error');
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  return (
    <Container className="py-3" id="add-project-form">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Add Project</h2>
          </Col>

          <div style={{ marginBottom: '12px' }}>
            <Link href="/project-list/" style={{ color: '#111613' }}>&lt;&nbsp;Back to Project List</Link>
          </div>

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

                    {/* Project Image */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ marginTop:'10px'}}>Image</Form.Label>
                      <Form.Control
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImgChange}
                      />
                      <Form.Text>
                        Upload an image (4MB limit). Supported formats: JPG, PNG, GIF, WebP 
                      </Form.Text>
    
                      {imgPre && (
                        <>
                          <Container className="d-flex align-items-start gap-3">
                            <img
                              src={imgPre}
                              alt="Image Preview"
                              style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #002224'
                              }} />
                          </Container>
                          <Button variant="danger" onClick={handleImgDel}>
                            Delete Image
                          </Button>
                        </>
                      )}
                    </Form.Group>
                  </Col>

                  <Col>
                    {/* Date Picker */}
                    <Form.Group>
                      <br />
                      <Form.Label className="mb-0">Due Date: &nbsp;</Form.Label>
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
                    style={{ height: '400px' }}
                  />
                  <div className="invalid-feedback">{errors.descrip?.message}</div>
                </Form.Group>

                {/* Buttons */}
                <Form.Group>
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary" className="btn-submit">
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
                        className="float-right btn-reset"
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
