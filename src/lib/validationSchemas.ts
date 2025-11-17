import * as Yup from 'yup';
import { Role, Skills } from '@prisma/client';

export const AddUserSchema = Yup.object({
  email: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
});

export const EditUserSchema = Yup.object({
  id: Yup.number().required(),
  email: Yup.string().email().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  role: Yup.string<Role>().oneOf(Object.values(Role)).required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  image: Yup.string().nullable().optional().default(null),
  phone: Yup.string().nullable().optional().default(null),
  skills: Yup.array().of(Yup.string<Skills>().oneOf(Object.values(Skills)).defined()).defined().default([]),
  availability: Yup.array().of(Yup.number().defined()).defined().default([]),
  contacts: Yup.array().of(Yup.number().integer().defined()).defined().default([]),
});

export const AddProjectSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  descrip: Yup.string().required('Description is required'),
  members: Yup.array().of(Yup.number()).optional(),
  admins: Yup.array().of(Yup.number()).optional(),
  image: Yup.string().optional(),
  duedate: Yup.string().optional(),
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
  member: Yup.number().optional(),
});
