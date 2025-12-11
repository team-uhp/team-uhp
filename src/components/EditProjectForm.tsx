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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserToggle from './UserToggle';

type EditProjectFormValues = {
  id: number;
  image?: string;
  title: string;
  descrip: string;
  duedate: string;
  positions?: number[];
  members?: number[];
  admins?: number[];
};

type EditProjectFormProps = {
  proj: {
    positions?: number[];
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
  const [imgPre, setImgPre] = useState<string | null>(proj.image || null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [img, setImg] = useState<File | null>(null);
  const router = useRouter();
  const UserToggleAny = UserToggle as unknown as React.ComponentType<{ name: string; isChecked: boolean; onChange: () => void; image?: string }>;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProjectFormValues>({
    resolver: yupResolver(EditProjectSchema) as unknown as Resolver<EditProjectFormValues>,
    defaultValues: {
      id: proj.id,
      title: proj.title,
      descrip: proj.descrip,
      duedate: proj.duedate || undefined,
      image: proj.image || undefined,
      positions: proj.positions || [],
      members: members?.map((m) => m.id) || [],
      admins: admins?.map((a) => a.id) || [],
    },
  });

  const watchMembers = (watch('members') as number[] | undefined) || [];
  const watchAdmins = (watch('admins') as number[] | undefined) || [];

  const handleMembersToggle = (memberId: number) => {
    const currentMembers = watchMembers || [];
    if (currentMembers.includes(memberId)) {
      setValue('members', currentMembers.filter(id => id !== memberId));
    } else {
      setValue('members', [...currentMembers, memberId]);
    }
  };

  const handleAdminsToggle = (adminId: number) => {
    const currentAdmins = watchAdmins || [];
    if (currentAdmins.includes(adminId)) {
      setValue('admins', currentAdmins.filter(id => id !== adminId));
    } else {
      setValue('admins', [...currentAdmins, adminId]);
    }
  };

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
      positions: data.positions || [],
      members: data.members || [],
      admins: data.admins || [],
    };

    try {
      if (projectData.members.length === 0 || projectData.admins.length === 0) throw new Error('At least one member and admin must be assigned');
      
      await editProject(projectData);
      swal('Success', 'Your project has been edited', 'success', { timer: 2000 });

      reset();
      handleImgDel();
      router.push(`/project-page/${proj.id}`);
    } catch {
      swal('Error', 'Something went wrong.', 'error');
    }
  };

  return (
    <Container className="py-3" id="edit-project-form">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Edit Project</h2>
          </Col>
          <div style={{ marginBottom: '12px' }}>
            <Link href={`/project-page/${proj.id}`} >Back to Project</Link>
          </div>
          <Card style={{ marginBottom: '80px' }}>
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

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('descrip')}
                    className={`form-control ${errors.descrip ? 'is-invalid' : ''}`}
                    style={{ height: '300px' }}
                  />
                  <div className="invalid-feedback">{errors.descrip?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
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
                      <Button variant="danger" onClick={handleImgDel} style={{ marginTop: '10px', height: '35px', fontSize: '14px' }}>
                        Delete Image
                      </Button>
                    </>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Members</Form.Label>
                  {Array.isArray(members) && members.length > 0 ? (
                    members.map((member) => (
                        <UserToggleAny
                          key={member.id}
                          name={member.name}
                          isChecked={watchMembers.includes(member.id)}
                          onChange={() => handleMembersToggle(member.id)}
                        />
                    ))
                  ) : (
                    <div>No members listed.</div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Admins</Form.Label>
                  {Array.isArray(members) && members.length > 0 ? (
                    members.map((member) => (
                        <UserToggleAny
                          key={member.id}
                          name={member.name}
                          isChecked={watchAdmins.includes(member.id)}
                          onChange={() => handleAdminsToggle(member.id)}
                        />
                    ))
                  ) : (
                    <div>No members to assign as admins.</div>
                  )}
                </Form.Group>

                <Row className="pt-3" style={{ marginTop: '10px' }}>
                  <Col>
                    <Button type="submit" variant="primary" className="btn-submit">
                      Update
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
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProjectForm;
