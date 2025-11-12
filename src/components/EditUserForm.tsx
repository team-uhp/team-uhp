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
  const parsedData = data;
  parsedData.availability = parsedData.availability.map((slot) => Number(slot));
  parsedData.contacts = parsedData.contacts.map((contact) => Number(contact));
  parsedData.skills = parsedData.skills.map((skill) => skill);
  await editUser(parsedData);
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

const EditUserForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(EditUserSchema),
  });

  const [tags, setTags] = useState<string[]>(user.skills); // State to store the tags
  console.log(tags);

  // Function to add a new tag
  const addTag = (newTag: any) => {
    if (newTag && !tags.includes(newTag)) { // Prevent adding empty or duplicate tags
      setTags([...tags, newTag]);
    }
  };

  // Function to remove a tag
  const removeTag = (tagToRemove: any) => {
    setTags(() => tags.filter(tag => tag !== tagToRemove));
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
                    defaultValue={user.username}
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
                <Form.Group>
                  <Form.Label>Skills</Form.Label>
                  <Row>
                    <Col>
                      <Form.Select>
                        <option key="default" value="">Select a skill to add</option>
                        {
                          Object.values(Skills).map((skill) => {
                            if (!tags.includes(skill)) {
                              return <option key={skill} value={skill}>{skill}</option>;
                            }
                            return null;
                          })
                        }
                      </Form.Select>
                      {/* <input
                        type="text"
                        {...register('skills')}
                        onKeyDown={(key) => {
                          if (key.key === 'Enter') {
                            addTag(key.currentTarget.value.trim());
                            // eslint-disable-next-line no-param-reassign
                            key.currentTarget.value = ''; // Clear the input field
                          }
                        }}
                        className={`form-control ${errors.skills ? 'is-invalid' : ''}`}
                      /> */}
                      <Button type="button" onClick={() => { addTag('NewSkill'); }} variant="secondary" className="mt-2">
                        Add
                      </Button>
                    </Col>
                  </Row>
                  <TagsContainer tags={user.skills.map((skill) => skill)} removeTag={removeTag} />
                  <div className="invalid-feedback">{errors.skills?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Availability</Form.Label>
                  <input
                    type="text"
                    {...register('availability')}
                    onKeyDown={(key) => {
                      if (key.key === 'Enter') {
                        addTag(key.currentTarget.value.trim());
                        // eslint-disable-next-line no-param-reassign
                        key.currentTarget.value = ''; // Clear the input field
                      }
                    }}
                    className={`form-control ${errors.availability ? 'is-invalid' : ''}`}
                  />
                  <TagsContainer tags={user.availability.map((slot) => slot.toString())} removeTag={removeTag} />
                  <div className="invalid-feedback">{errors.availability?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contacts</Form.Label>
                  <input
                    type="text"
                    {...register('contacts')}
                    defaultValue={user.contacts.map((contact) => contact.toString()).join(', ')}
                    className={`form-control ${errors.contacts ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.contacts?.message}</div>
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
