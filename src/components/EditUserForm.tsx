'use client';

import React, { useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, Skills } from '@prisma/client';
import { EditUserSchema } from '@/lib/validationSchemas';
import { editUser } from '@/lib/dbActions';
import { useState } from 'react';
import { InferType } from 'yup';
import TagsContainer from './TagsContainer';
import { useRouter } from 'next/navigation';

type EditUserFormData = InferType<typeof EditUserSchema>;

function useForceUpdate() {
  const [value, setValue] = useState(0);
  console.log(`forceUpdate value: ${value}`);
  return () => setValue((v) => v + 1);
}
  // A function that increment the previous state like here
function EditUserForm({ user }: { user: User }) {
   const [imgPre, setImgPre] = useState<string | null>(user.image || null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [img, setImg] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: yupResolver(EditUserSchema),
    defaultValues: user as EditUserFormData,
  });

  const forceUpdate = useForceUpdate();
  const router = useRouter();

  const [skillTags, setSkillTags] = useState<Skills[]>(user.skills ?? []); // State to store the tags

  // Register array fields and file input so setValue works without inputs
  useEffect(() => {
    register("skills");
    register("availability");
    register("image");
  }, [register]);

  // Keep RHF values in sync with local state
  useEffect(() => {
    setValue("skills", skillTags, { shouldDirty: true, shouldValidate: true });
  }, [skillTags, setValue]);

  // Function to add a new tag
  const addTag = <T,>(newTag: T, tags: T[], setTags: (tags: T[]) => void) => {
    if (newTag && !tags.includes(newTag)) { // Prevent adding empty or duplicate tags
      setTags([...tags, newTag]);
    }
  };

  const removeTag = <T,>(tagToRemove: T, tags: T[], setTags: (tags: T[]) => void) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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

  const onSubmit = async (data: EditUserFormData) => {
    console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
    
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
      skills: skillTags,
      availability: data.availability,
      contacts: data.contacts,
    });
    swal('Success', 'Your item has been updated', 'success', {
      timer: 2000,
    });
    router.push(`/user-profile/${user.id}`);
  };

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
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <input
                    type="text"
                    {...register('username')}
                    disabled
                    readOnly
                    defaultValue={user.username ? user.username : ''}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
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
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
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
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
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
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <input
                    type="text"
                    {...register('phone')}
                    defaultValue={user.phone ? user.phone?.toString() : ''}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.phone?.message}</div>
                </Form.Group>
                <Form.Group onClick={forceUpdate}>
                  <Form.Label>Skills</Form.Label>
                  <TagsContainer
                    defaultValue="Select a skill to add"
                    type="skills"
                    tags={skillTags}
                    removeTag={(tag) => removeTag(tag, skillTags, setSkillTags)}
                    addTag={(tag) => addTag(tag, skillTags, setSkillTags)}
                    forceUpdate={forceUpdate}
                  />
                  <div className="invalid-feedback">{errors.skills?.message}</div>
                </Form.Group>
                <Form.Group className="form-group" style={{ marginTop:'15px' }}>
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary" className="btn-submit">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right btn-reset">
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
}

export default EditUserForm;
