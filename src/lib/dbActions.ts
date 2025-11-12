'use server';

import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Role, Skills } from '@prisma/client';
import { prisma } from './prisma';
import authOptions from './authOptions';

/**
 * Adds a new project to the database.
 * @param project, an object with the following
 * properties: image, title, descrip, duedate.
 */
export async function addProject(project: {
  image: string,
  title: string,
  descrip: string,
  duedate: string,
  members: number[],
  admins: number[]
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('No authenticated user');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('User not found');

  const userId = user.id;
  // console.log(`addProject data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.project.create({
    data: {
      image: project.image,
      title: project.title,
      descrip: project.descrip,
      members: [userId],
      admins: [userId],
      duedate: new Date(project.duedate).toISOString(),
    },
  });
  // After adding, redirect to the list page
  redirect('/project-list');
}

/**
 * Edits an existing project in the database.
 * @param project, an object with the following
 * properties: id, image, title, descrip,
 * positions, members, admins, duedate, skills.
 */
export async function editProject(project: {
  id: number,
  image: string,
  title: string,
  descrip: string,
  positions: number[],
  members: number[],
  admins: number[],
  duedate: string,
  skills: Skills[],
}) {
  // console.log(`editStuff data: ${JSON.stringify(project, null, 2)}`);
  await prisma.project.update({
    where: { id: project.id },
    data: {
      id: project.id,
      image: project.image,
      title: project.title,
      descrip: project.descrip,
      positions: project.positions,
      members: project.members,
      admins: project.admins,
      duedate: project.duedate,
      skills: project.skills,
    },
  });
  // After updating, redirect to the list page
  redirect('/project-list');
}

/**
 * Deletes an existing project from the database.
 * @param id, the id of the project to delete.
 */
export async function deleteProject(id: number) {
  // console.log(`deleteProject id: ${id}`);
  await prisma.project.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/project-list');
}

/**
 * Adds a new position to the database.
 * @param position, an object with the following
 * properties: image, title, descrip, skills,
 * datestart, dateend, project.
 */
export async function addPosition(position: {
  image: string,
  title: string,
  descrip: string,
  skills: Skills[],
  datestart: string,
  dateend: string,
  project: number
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('No authenticated user');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('User not found');

  const userId = user.id;
  // console.log(`addPosition data: ${JSON.stringify(stuff, null, 2)}`);
  const posit = await prisma.position.create({
    data: {
      image: position.image,
      title: position.title,
      descrip: position.descrip,
      skills: position.skills,
      datestart: position.datestart,
      dateend: position.dateend,
      admins: [userId],
      project: position.project,
    },
  });

  await prisma.project.update({
    where: { id: position.project },
    data: {
      positions: {
        push: posit.id,
      },
    },
  });
  // After adding, redirect to the list page
  redirect('/project-list');
}

/**
 * Edits an existing project in the database.
 * @param position, an object with the following
 * properties: id, image, title, descrip,
 * positions, members, admins, duedate, skills.
 */
export async function editPosition(position: {
  id: number,
  image: string,
  title: string,
  descrip: string,
  skills: Skills[],
  datestart: string,
  dateend: string,
  project: number,
  admins: number[],
  member: number,
}) {
  // console.log(`editStuff data: ${JSON.stringify(project, null, 2)}`);
  await prisma.position.update({
    where: { id: position.id },
    data: {
      id: position.id,
      image: position.image,
      title: position.title,
      descrip: position.descrip,
      skills: position.skills,
      datestart: position.datestart,
      dateend: position.dateend,
      project: position.project,
      admins: position.admins,
      member: position.member,
    },
  });
  // After updating, redirect to the list page
  redirect('/project-list');
}

/**
 * Deletes an existing position from the database.
 * @param id, the id of the project to delete.
 */
export async function deletePosition(id: number) {
  // console.log(`deleteProject id: ${id}`);
  await prisma.position.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/project-list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following
 * properties: email, username, password, firstName,
 * lastName, image, phone.
 */
export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string;
  phone: string;
}) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const { email, password } = data;
  const hashedPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'USER',
      username: email.split('@')[0],
      firstName: 'Change',
      lastName: 'Me',
      image: '',
      phone: '',
    },
  });

  return user;
}

/**
 * Edits a user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function editUser(credentials: {
  id: number;
  email: string;
  username:string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  image: string | null;
  phone: string | null;
  skills: Skills[];
  availability: number[];
  contacts: number[];
}) {
  // console.log(`editStuff data: ${JSON.stringify(project, null, 2)}`);
  await prisma.user.update({
    where: { id: credentials.id },
    data: {
      id: credentials.id,
      email: credentials.email,
      username: credentials.username,
      password: credentials.password,
      role: credentials.role,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      image: credentials.image,
      phone: credentials.phone,
      skills: credentials.skills,
      availability: credentials.availability,
      contacts: credentials.contacts,
    },
  });
  // After updating, redirect to the list page
  redirect('/user-profile');
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
