import * as Yup from 'yup';

export const AddUserSchema = Yup.object({
  email: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
});

export const EditUserSchema = Yup.object({
  id: Yup.number().required(),
  email: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  role: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  image: Yup.string().optional(),
  phone: Yup.string().optional(),
  skills: Yup.array().of(Yup.string()),
  availability: new Yup.ArraySchema().required(),
  contacts: Yup.array().of(Yup.number()).required(),
});

export const AddProjectSchema = Yup.object({
  image: Yup.string().optional(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  duedate: Yup.string().optional(),
  members: Yup.array().of(Yup.number()).required(),
  admins: Yup.array().of(Yup.number()).required(),
});

export const EditProjectSchema = Yup.object({
  id: Yup.number().required(),
  image: Yup.string(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  positions: Yup.array().of(Yup.number()).required(),
  members: Yup.array().of(Yup.number()).required(),
  admins: Yup.array().of(Yup.number()).required(),
  duedate: Yup.string().required(),
  skills: Yup.array().of(Yup.string()),
});

export const AddPositionSchema = Yup.object({
  image: Yup.string(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  skills: Yup.array().of(Yup.string()),
  datestart: Yup.string().optional(),
  dateend: Yup.string().optional(),
  project: Yup.number().required(),
  admins: Yup.array().of(Yup.number()).required(),
});

export const EditPositionSchema = Yup.object({
  id: Yup.number().required(),
  image: Yup.string(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  skills: Yup.array().of(Yup.string()),
  datestart: Yup.string().required(),
  dateend: Yup.string().required(),
  project: Yup.number().required(),
  admins: Yup.array().of(Yup.string()).required(),
  member: Yup.number().optional().nullable(),
});
