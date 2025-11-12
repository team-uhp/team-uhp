'use client';

/* eslint-disable react/prop-types */
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { addPosition } from '@/lib/dbActions';
import { AddPositionSchema } from '@/lib/validationSchemas';
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DateRange, DayPicker } from 'react-day-picker';
import Link from 'next/link';
import { Skills } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    resolver: yupResolver(AddPositionSchema) as any,
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

    await addPosition(openingData);
    await swal('Success', 'Your item has been added', 'success', {
      timer: 2000,
    });
    reset();
    setSelected(undefined);
    router.push('/project-list');
    setIsSubmitting(false);
  };

  return (
    <Container className="py-3" fluid>
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
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default AddOpeningForm;
