/* eslint-disable max-len */

'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, Skills } from '@prisma/client';
import { EditUserSchema } from '@/lib/validationSchemas';
import { editUser } from '@/lib/dbActions';
import { useState } from 'react';
import TagsContainer from './TagsContainer';

const onSubmit = async (data: User) => {
  console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await editUser(data);
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  console.log(`forceUpdate value: ${value}`);
  return () => setValue(() => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

const EditUserForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(EditUserSchema),
    defaultValues: user,
  });
  const forceUpdate = useForceUpdate();

  const [skillTags, setSkillTags] = useState<Skills[]>(user.skills); // State to store the tags
  console.log(skillTags);
  // Function to add a new tag
  const addTag = (newTag: any, tags: any[], setTags: (tags: any[]) => void) => {
    if (newTag && !tags.includes(newTag)) { // Prevent adding empty or duplicate tags
      setTags([...tags, newTag]);
    }
  };

  // Function to remove a tag
  const removeTag = (tagToRemove: any, tags: any[], setTags: (tags: any[]) => void) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={8}>
          <Col className="text-center">
            <h2>Edit Profile</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={user.id} />
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <input
                    type="text"
                    {...register('email')}
                    defaultValue={user.email}
                    required
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <input
                    type="text"
                    {...register('username')}
                    defaultValue={user.username ? user.username : ''}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.username?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <input
                    type="password"
                    {...register('password')}
                    defaultValue={user.password}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </Form.Group>
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
                <Form.Group>
                  <Form.Label>Profile Image</Form.Label>
                  <input
                    type="text"
                    {...register('image')}
                    defaultValue={user.image ? user.image : ''}
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.image?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <input
                    type="text"
                    {...register('phone')}
                    defaultValue={user.phone ? user.phone?.toString() : ''}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.phone?.message}</div>
                </Form.Group>
                <Form.Group onClick={forceUpdate}>
                  <Form.Label>Skills</Form.Label>
                  <TagsContainer
                    tags={skillTags.map((skill) => skill)}
                    removeTag={removeTag}
                    addTag={addTag}
                    forceUpdate={forceUpdate}
                    {...register('skills')}
                  />
                  <div className="invalid-feedback">{errors.skills?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Availability</Form.Label>
                  <TagsContainer
                    tags={user.availability.map((slot) => slot.toString())}
                    removeTag={removeTag}
                    addTag={addTag}
                    forceUpdate={forceUpdate}
                    {...register('availability')}
                  />
                  <div className="invalid-feedback">{errors.availability?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contacts</Form.Label>
                  <TagsContainer
                    tags={user.availability.map((slot) => slot.toString())}
                    removeTag={removeTag}
                    addTag={addTag}
                    forceUpdate={forceUpdate}
                    {...register('contacts')}
                  />
                </Form.Group>
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

export default EditUserForm;
