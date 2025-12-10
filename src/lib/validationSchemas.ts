import * as Yup from 'yup';
import { Role, Skills } from '@prisma/client';

export const AddUserSchema = Yup.object({
  email: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  validation: Yup.boolean().required(),
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
  validation: Yup.boolean().required().default(false),
  validcheck: Yup.string().optional().nullable(),
  passchgcanx: Yup.string().optional().nullable(),
  validpasschg: Yup.string().optional().nullable(),
});

export const AddProjectSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(60, 'Title must be at most 60 characters'),
  descrip: Yup.string().required('Description is required'),
  members: Yup.array().of(Yup.number().defined()).default([]),
  admins: Yup.array().of(Yup.number().defined()).default([]),
  image: Yup.string().optional(),
  duedate: Yup.string().optional(),
});

export const EditProjectSchema = Yup.object({
  id: Yup.number().required(),
  image: Yup.string(),
  title: Yup.string()
    .required()
    .max(60, 'Title must be at most 60 characters'),
  descrip: Yup.string().required(),
  positions: Yup.array().of(Yup.number()).required(),
  members: Yup.array()
    .of(Yup.number().required())
    .min(1, 'Must have at least one member')
    .required(),
  admins: Yup.array()
    .of(Yup.number().required())
    .min(1, 'Must have at least one admin')
    .required(),
  duedate: Yup.string().required(),
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
  skills: Yup.array().of(Yup.string()).required(),
  datestart: Yup.string().required(),
  dateend: Yup.string().required(),
  project: Yup.number().required(),
  admins: Yup.array().of(Yup.string()).required(),
  member: Yup.number().optional(),
});

export const ApplyPositionSchema = Yup.object({
  userId: Yup.number().required(),
  positionId: Yup.number().required(),
  application: Yup.string().optional(),
});

export const ApplyEditSchema = Yup.object({
  application: Yup.string().optional(),
});
