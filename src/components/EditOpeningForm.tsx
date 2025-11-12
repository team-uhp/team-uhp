'use client';

/* eslint-disable react/prop-types */
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { editPosition, deletePosition } from '@/lib/dbActions';
import { EditPositionSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DateRange, DayPicker } from 'react-day-picker';
import Link from 'next/link';
import { Position, Skills } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SkillSelect from './SkillSelect';

type PositionFormValues = {
  id: number;
  image?: string;
  title: string;
  descrip: string;
  skills: Skills[];
  datestart?: string;
  dateend?: string;
  project: number;
  admins: number[];
  member: number | null;
};

type EditOpeningFormProps = {
  position: Position;
};

const EditOpeningForm: React.FC<EditOpeningFormProps> = ({ position }) => {
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

  useEffect(() => {
    if (position.skills && position.skills.length > 0) {
      const initialSkills = position.skills.reduce((acc, skill) => ({
        ...acc,
        [skill]: true,
      }), {} as Record<string, boolean>);
      setSelectedSkills(initialSkills);
    }
  }, [session, position.skills]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: yupResolver(EditPositionSchema) as any,
    defaultValues: {
      id: position.id,
      title: position.title,
      descrip: position.descrip,
      datestart: position.datestart,
      dateend: position.dateend,
      admins: Array.isArray(position.admins)
        ? position.admins.map(id => Number(id))
        : [],
      member: position.member ?? undefined,
      image: position.image ?? undefined,
      skills: position.skills,
      project: position.project,
    },
  });

  useEffect(() => {
    if (position.datestart && position.dateend) {
      setSelected({
        from: new Date(position.datestart),
        to: new Date(position.dateend),
      });
    }
  }, [position.datestart, position.dateend]);

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
      setValue('admins', [Number(userId)]);
    }
  }, [userId, setValue]);

  const onSubmit = async (data: PositionFormValues) => {
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
      skills: data.skills,
      datestart: selected.from.toISOString(),
      dateend: selected.to?.toISOString() || selected.from.toISOString(),
      project: position.project,
      admins: data.admins.map(id => Number(id)),
      member: data.member ?? null,
    };

    console.log('Submitting opening data:', openingData);

    try {
      await editPosition(openingData);
      await swal('Success', 'Your position has been edited', 'success', {
        timer: 2000,
      });
      reset();
      setSelected(undefined);
      router.push(`/project-opening/${position.id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return;
      }
      await swal('Error', 'Your position was not edited', 'error', {
        timer: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-3" fluid>
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center">
            <h2>Edit Opening</h2>
          </Col>
          <Link
            href={`/project-opening/${position.id}`}
          >
            Back to Opening
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
                <Form.Group>
                  <DayPicker
                    mode="range"
                    required
                    disabled={{ before: new Date() }}
                    selected={selected}
                    onSelect={setSelected}
                    footer={
                      // eslint-disable-next-line max-len
                      selected?.from ? `Selected: ${selected.from.toLocaleDateString()}${selected.to ? ` - ${selected.to.toLocaleDateString()}` : ''}` : 'Pick a day.'
                    }
                  />
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
                        value={selectedSkills[skill] || false}
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
                    <Col>
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
                            const proj = position.project;
                            await deletePosition(position.id);
                            swal('Success!', 'Position deleted.', 'success', {
                              timer: 2000,
                            });
                            router.push(`/project-page/${proj}`);
                          } else {
                            swal('Cancelled', 'Position was not deleted', 'info', {
                              timer: 2000,
                            });
                          }
                        }}
                        variant="danger"
                        className="float-right"
                      >
                        DELETE
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
