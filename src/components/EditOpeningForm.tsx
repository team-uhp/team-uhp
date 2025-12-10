'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { editPosition, deletePosition } from '@/lib/dbActions';
import { EditPositionSchema } from '@/lib/validationSchemas';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';
import { Position, Skills } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SkillSelect from './SkillSelect';
import { splitCamelCase } from '@/utilities/format';
import { groupedSkills } from '@/utilities/skills';

type PositionFormValues = {
  id: number;
  image?: string;
  title: string;
  descrip: string;
  skills: string[];
  datestart: string;
  dateend: string;
  project: number;
  admins: string[];
  member?: number;
};

type EditOpeningFormProps = {
  position: Position;
};

const EditOpeningForm: React.FC<EditOpeningFormProps> = ({ position }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [selected, setSelected] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (session?.user && 'id' in session.user) {
      setUserId(session.user.id as number);
    }
  }, [session]);

  useEffect(() => {
    if (position.skills && position.skills.length > 0) {
      const initialSkills = position.skills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {} as Record<string, boolean>);
      setSelectedSkills(initialSkills);

      // NEW: set selectedField to the first field that has a pre-selected skill
      const fields = Object.keys(groupedSkills);
      const firstFieldWithSkill = fields.find(field =>
        groupedSkills[field].some(skill => initialSkills[skill])
      );
      if (firstFieldWithSkill) {
        setSelectedField(firstFieldWithSkill);
      }
    }
  }, [position.skills]);


  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PositionFormValues>({
    resolver: yupResolver(EditPositionSchema) as unknown as Resolver<PositionFormValues>,
    defaultValues: {
      id: position.id,
      title: position.title,
      descrip: position.descrip,
      datestart: position.datestart,
      dateend: position.dateend,
      admins: [],
      member: position.memberId ?? undefined,
      image: position.image ?? undefined,
      skills: Array.isArray(position.skills) ? position.skills : [],
      project: position.projectId ?? 0,
    },
  });

  useEffect(() => {
    if (position.datestart && position.dateend) {
      setSelected({ from: new Date(position.datestart), to: new Date(position.dateend) });
    }
  }, [position.datestart, position.dateend]);

  useEffect(() => {
    const skillsArray = Object.entries(selectedSkills)
      .filter(([, isSelected]) => isSelected)
      .map(([skill]) => skill);
    setValue('skills', skillsArray);
  }, [selectedSkills, setValue]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => ({ ...prev, [skill]: !prev[skill] }));
  };

  useEffect(() => {
    if (selected?.from) setValue('datestart', selected.from.toISOString());
    if (selected?.to) setValue('dateend', selected.to.toISOString());
  }, [selected, setValue]);

  useEffect(() => {
    if (userId > 0) setValue('admins', [String(userId)]);
  }, [userId, setValue]);

  const onSubmit: SubmitHandler<PositionFormValues> = async (data) => {
    if (!selected?.from) {
      swal('Error', 'Please select a due date', 'error');
      return;
    }
    setIsSubmitting(true);

    const openingData = {
      id: position.id,
      image: data.image || '',
      title: data.title,
      descrip: data.descrip,
      skills: data.skills.map(skill => skill as Skills),
      datestart: selected.from.toISOString(),
      dateend: selected.to?.toISOString() || selected.from.toISOString(),
      project: position.projectId ?? 0,
      admins: data.admins.map(Number),
      member: data.member ?? null,
    };

    try {
      if (openingData.project !== 0) {
        await editPosition(openingData);
        await swal('Success', 'Your position has been edited', 'success', { timer: 2000 });
        reset();
        setSelected(undefined);
        router.push(`/project-opening/${position.id}`);
      }
    } catch {
      await swal('Error', 'Your position was not edited', 'error', { timer: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-3" id="edit-opening-form">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Edit Opening</h2>
          </Col>
          <Link href={`/project-opening/${position.id}`} className="mb-3 d-inline-block">
            Back to Opening
          </Link>
          <Card className="mb-5">
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
                    <Form.Group className="mb-3 mt-4">
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
                      {errors.datestart && <div className="text-danger mt-2">{errors.datestart.message}</div>}
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

                {/* Field / Group Dropdown */}
                <Form.Group className="mb-3">
                  <Form.Label>Field / Group</Form.Label>
                  <Form.Select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                  >
                    <option value="" disabled>
                      Please select a field...
                    </option>
                    {Object.keys(groupedSkills).map((field) => (
                      <option key={field} value={field}>
                        {splitCamelCase(field)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                {selectedField && (
                  <Form.Group>
                    <Form.Label>Skills Needed:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {groupedSkills[selectedField].map((skill) => (
                        <SkillSelect
                          key={`skill-${skill}`}
                          skill={skill}
                          isSelected={selectedSkills[skill] || false}
                          onChange={() => handleSkillToggle(skill)}
                          label={splitCamelCase(skill)}
                        />
                      ))}
                    </div>
                  </Form.Group>
                )}

                {/* Currently Selected Skills */}
                {Object.entries(selectedSkills).filter(([, isSelected]) => isSelected).length > 0 && (
                  <Form.Group className="mt-3">
                    <Form.Label>Selected Skills:</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(selectedSkills)
                        .filter(([, isSelected]) => isSelected)
                        .map(([skill]) => (
                          <Button
                            key={`selected-${skill}`}
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



                <Form.Group className="form-group mt-3" >
                  <Row>
                    <Col>
                      <Button className="btn-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update'}
                      </Button>
                    </Col>
                    <Col className="text-end">
                    <Button
                        type="button"
                        onClick={() => {
                          reset();
                          setSelectedSkills({});
                          setSelected({
                            from: position.datestart ? new Date(position.datestart) : undefined,
                            to: position.dateend ? new Date(position.dateend) : undefined
                          });
                        }}
                        className="float-right btn-reset"
                        style={{ marginRight: '25px' }}
                      >
                        Reset
                      </Button>
                      <Button
                        type="button"
                        onClick={async (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const willDelete = await swal({
                            title: 'Are you sure you want to delete?',
                            text: 'This action cannot be undone.',
                            icon: 'warning',
                            buttons: ['Cancel', 'Delete'],
                            dangerMode: true,
                          });
                          if (willDelete) {
                            const proj = position.projectId ?? '';
                            await deletePosition(position.id);
                            swal('Success!', 'Position deleted.', 'success', { timer: 2000 });
                            router.push(`/project-page/${proj}`);
                          }
                        }}
                        variant="danger"
                        className="float-right"
                      >
                        Delete
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

export default EditOpeningForm;
