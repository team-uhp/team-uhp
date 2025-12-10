'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, Skills } from '@prisma/client';
import { EditUserSchema } from '@/lib/validationSchemas';
import { editUser } from '@/lib/dbActions';
import { InferType } from 'yup';
import { useRouter } from 'next/navigation';
import { groupedSkills } from '@/utilities/skills'; // Added
import { splitCamelCase } from '@/utilities/format'; // Added
import SkillSelect from './SkillSelect'; // Added

type EditUserFormData = InferType<typeof EditUserSchema>;

function useForceUpdate() {
  const [_value, setValue] = useState(0);
  return () => setValue((v) => v + 1);
}

function EditUserForm({ user }: { user: User }) {
  const router = useRouter();
  const forceUpdate = useForceUpdate();

  //  State 
  const [imgPre, setImgPre] = useState<string | null>(user.image ?? null);
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({}); // Added
  const [selectedField, setSelectedField] = useState<string>(''); // Added

  //  React Hook Form 
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditUserFormData>({
    resolver: yupResolver(EditUserSchema),
    defaultValues: user as EditUserFormData,
  });

  // Register array fields and file input
  useEffect(() => {
    register("skills");
    register("availability");
    register("image");
  }, [register]);

  //  Pre-populate selectedSkills 
  useEffect(() => {
    if (user.skills && user.skills.length > 0) {
      const initialSkills = user.skills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {} as Record<string, boolean>);
      setSelectedSkills(initialSkills);
    }
  }, [user.skills]);

  //  Automatically select a field that contains existing skills 
  useEffect(() => {
    if (!selectedField && user.skills?.length) {
      const field = Object.keys(groupedSkills).find(f =>
        groupedSkills[f].some(skill => user.skills.includes(skill))
      );
      if (field) setSelectedField(field); // Added
    }
  }, [user.skills, selectedField]);

  //  Keep selectedSkills in RHF 
  useEffect(() => {
    const skillsArray = Object.entries(selectedSkills)
      .filter(([, isSelected]) => isSelected)
      .map(([skill]) => skill) as Skills[]; // <-- cast to Skills[]
    setValue('skills', skillsArray);
  }, [selectedSkills, setValue]);

  // Image handling 
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
    setImgPre(null);
    setValue('image', '');
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  //  Skill button toggle 
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => ({ ...prev, [skill]: !prev[skill] }));
    forceUpdate();
  }

  //  Submit 
  const onSubmit = async (data: EditUserFormData) => {
    await editUser({
      id: data.id,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image ?? null,
      phone: data.phone ?? null,
      skills: Object.entries(selectedSkills).filter(([, v]) => v).map(([k]) => k as Skills), // Added
      availability: data.availability,
      contacts: data.contacts,
    });
    swal('Success', 'Your profile has been updated', 'success', { timer: 2000 });
    router.push(`/user-profile/${user.id}`);
  };

  //  Reset handler 
  const handleReset = () => {
    reset(); // Reset RHF values
    setImgPre(user.image ?? null); // Reset image preview
    // Reset skills
    const initialSkills = user.skills?.reduce((acc, skill) => ({ ...acc, [skill]: true }), {} as Record<string, boolean>) ?? {};
    setSelectedSkills(initialSkills);
    // Reset selected field to match first skill
    const field = Object.keys(groupedSkills).find(f =>
      groupedSkills[f].some(skill => user.skills?.includes(skill))
    );
    setSelectedField(field ?? '');
  }

  return (
    <Container className="py-3" id="edit-user-form">
      <Row className="justify-content-center">
        <Col xs={8}>
          <Col className="text-center">
            <h2>Edit Profile</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={user.id} />
                <input type="hidden" {...register('password')} value={user.password} />
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <input
                    type="text"
                    {...register('email')}
                    defaultValue={user.email}
                    disabled
                    readOnly
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <input
                    type="text"
                    {...register('username')}
                    disabled
                    readOnly
                    defaultValue={user.username ?? ''}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.username?.message}</div>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <input
                        type="text"
                        {...register('firstName')}
                        defaultValue={user.firstName}
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.firstName?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <input
                        type="text"
                        {...register('lastName')}
                        defaultValue={user.lastName}
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.lastName?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImgChange}
                  />
                  <Form.Text>Upload an image (4MB limit). Supported formats: JPG, PNG, GIF, WebP</Form.Text>

                  {imgPre && (
                    <>
                      <Container className="d-flex align-items-start gap-3 mt-2">
                        <img
                          src={imgPre}
                          alt="Image Preview"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #002224'
                          }}
                        />
                      </Container>
                      <Button variant="danger" onClick={handleImgDel} className="mt-2">
                        Delete Image
                      </Button>
                    </>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <input
                    type="text"
                    {...register('phone')}
                    defaultValue={user.phone?.toString() ?? ''}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.phone?.message}</div>
                </Form.Group>

                {/* Field / Group Dropdown */}
                <Form.Group className="mt-3">
                  <Form.Label>Field / Group</Form.Label>
                  <Form.Select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                  >
                    <option value="" disabled>Select a field...</option>
                    {Object.keys(groupedSkills).map((field) => (
                      <option key={field} value={field}>{splitCamelCase(field)}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Skills filtered by selected Field */}
                {selectedField && (
                  <Form.Group className="mt-3">
                    <Form.Label>Skills Needed</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {groupedSkills[selectedField].map((skill) => (
                        <SkillSelect
                          key={skill}
                          skill={skill}
                          isSelected={selectedSkills[skill] || false}
                          onChange={() => handleSkillToggle(skill)}
                          label={splitCamelCase(skill)}
                        />
                      ))}
                    </div>
                  </Form.Group>
                )}

                {/* Selected Skills */}
                {Object.entries(selectedSkills).filter(([, v]) => v).length > 0 && (
                  <Form.Group className="mt-3">
                    <Form.Label>Selected Skills</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(selectedSkills).filter(([, v]) => v).map(([skill]) => (
                        <Button
                          key={skill}
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {splitCamelCase(skill)}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                )}

                <Form.Group className="mt-3">
                  <Row>
                    <Col>
                      <Button type="submit" variant="primary" className="btn-submit">Update</Button>
                    </Col>
                    <Col className="text-end">
                      <Button type="button" onClick={handleReset} className="btn-reset" variant="warning">Revert</Button>
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
}

export default EditUserForm;
