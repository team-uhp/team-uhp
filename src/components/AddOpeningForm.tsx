'use client';

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { addPosition } from '@/lib/dbActions';
import { AddPositionSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker'; // subject to changee
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';
import { Skills } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SkillSelect from './SkillSelect';

type PositionFormValues = {
  image?: string;
  title: string;
  descrip: string;
  skills: Skills[];
  datestart?: string;
  dateend?: string;
  project: number;
  admins: number[];
};

type AddOpeningFormProps = {
  projectId: number;
};

const AddOpeningForm: React.FC<AddOpeningFormProps> = ({ projectId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (session?.user && 'id' in session.user) {
      setUserId(session.user.id as number);
    }
  }, [session]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: yupResolver(AddPositionSchema) as Resolver<PositionFormValues>,
    defaultValues: {
      title: '',
      descrip: '',
      datestart: new Date().toISOString(),
      dateend: new Date().toISOString(),
      admins: [],
      image: '',
      skills: [],
      project: projectId,
    },
  });

  useEffect(() => {
    const skillsArray = Object.entries(selectedSkills)
      .filter(([, isSelected]) => isSelected)
      .map(([skill]) => skill as Skills);
    setValue('skills', skillsArray);
  }, [selectedSkills, setValue]);

  const handleSkillToggle = (skillname: string) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillname]: !prev[skillname],
    }));
  };

  useEffect(() => {
    if (selected?.from) {
      setValue('datestart', selected.from.toISOString());
    }
    if (selected?.to) {
      setValue('dateend', selected.to.toISOString());
    }
  }, [selected, setValue]);

  useEffect(() => {
    if (userId > 0) {
      setValue('admins', [userId]);
    }
  }, [userId, setValue]);

  const onSubmit = async (data: PositionFormValues) => {
    if (!selected?.from) {
      swal('Error', 'Please select a due date', 'error');
      return;
    }

    setIsSubmitting(true);

    const openingData = {
      image: data.image || '',
      title: data.title,
      descrip: data.descrip,
      skills: data.skills,
      datestart: selected.from.toISOString(),
      dateend: selected.to?.toISOString() || selected.from.toISOString(),
      project: projectId,
    };

    console.log('Submitting opening data:', openingData);

    try {
      await addPosition(openingData);
      await swal('Success', 'Your position has been added', 'success', {
        timer: 2000,
      });
      reset();
      setSelected(undefined);
      router.push(`/project-page/${projectId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return;
      }
      await swal('Failure', 'Your position was not added');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    console.log('Current form errors:', errors);
  }, [errors]);
  console.log('Form errors:', errors);
  console.log('skills:', selectedSkills);
  console.log('selected date:', selected);
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Recruit for Opening</h2>
          </Col>
          <Link
            href="/project-list/"
          >
            Back to Project List
          </Link>
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
                    <br />
                    <Form.Group className="mb-3">
                      <Form.Label className="me-2 mb-0">Timeline:</Form.Label>
                      <DatePicker
                        selectsRange
                        startDate={selected?.from || null}
                        endDate={selected?.to || null}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setSelected({ from: start || undefined, to: end || undefined });
                          if (start) setValue("datestart", start.toISOString());
                          if (end) setValue("dateend", end.toISOString());
                        }}
                        minDate={new Date()}
                        placeholderText="Select a start and end date"
                        className="form-control"
                      />
                      {errors.datestart && (
                        <div className="text-danger mt-2">{errors.datestart.message}</div>
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
               

                {errors.datestart && (
                <div className="text-danger mt-2">{errors.datestart.message}</div>
                )}
                <Form.Group>
                  <Form.Label>Skills Needed:</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.values(Skills).map((skill) => (
                      <SkillSelect
                        key={`skill-${skill}`}
                        skill={skill}
                        isSelected={selectedSkills[skill] || false}
                        onChange={() => handleSkillToggle(skill)}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={() => {
                          reset();
                          setSelectedSkills({});
                          setSelected(undefined);
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

export default AddOpeningForm;
