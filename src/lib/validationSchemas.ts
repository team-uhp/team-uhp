import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

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
  image: Yup.string(),
  phone: Yup.string(),
  skills: new Yup.ArraySchema().required(),
  availability: new Yup.ArraySchema().required(),
  contacts: new Yup.ArraySchema().required(),
});

export const AddProjectSchema = Yup.object({
  image: Yup.string().optional(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  duedate: Yup.string().optional(),
  members: new Yup.ArraySchema().optional(),
  admins: new Yup.ArraySchema().optional(),
});

export const EditProjectSchema = Yup.object({
  id: Yup.number().required(),
  image: Yup.string(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  positions: new Yup.ArraySchema().required(),
  members: new Yup.ArraySchema().required(),
  admins: new Yup.ArraySchema().required(),
  duedate: Yup.string().required(),
  skills: new Yup.ArraySchema().required(),
});

export const AddPositionSchema = Yup.object({
  image: Yup.string(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  skills: new Yup.ArraySchema(),
  datestart: Yup.string().required(),
  dateend: Yup.string().required(),
  project: Yup.number().required(),
  admins: new Yup.ArraySchema().required(),
});

export const EditPositionSchema = Yup.object({
  id: Yup.number().required(),
  image: Yup.string(),
  title: Yup.string().required(),
  descrip: Yup.string().required(),
  skills: new Yup.ArraySchema(),
  datestart: Yup.string().required(),
  dateend: Yup.string().required(),
  project: Yup.number().required(),
  admins: new Yup.ArraySchema().required(),
  member: Yup.number(),
});
