'use server';

import { hash, compare } from 'bcrypt';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Role, Skills } from '@prisma/client';
import { prisma } from './prisma';
import authOptions from './authOptions';
import sendAutoEmail from './email';
import keyGen from './keygen';

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

  const projectData = await prisma.project.findUnique({
    where: { id: position.project },
  });

  const setSkills = Array.from(new Set([...projectData?.skills || [], ...posit.skills]));

  await prisma.project.update({
    where: { id: position.project },
    data: {
      positions: {
        push: posit.id,
      },
      skills: setSkills,
    },
  });
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
  member: number | null,
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
      admins: position.admins as number[],
      member: position.member,
    },
  });

  const project = await prisma.project.findUnique({ where: { id: position.project } });
  if (!project) {
    redirect('/project-list/');
  }
  const updatedPositions = project?.positions.filter(p => p !== position.id) || [];
  await prisma.project.update({
    where: { id: position.project },
    data: {
      positions: {
        set: updatedPositions,
      },
    },
  });

  const remainingPositions = await prisma.position.findMany({
    where: { id: { in: updatedPositions } },
  });

  const updatedSkills = Array.from(new Set(remainingPositions.flatMap(p => p.skills)));

  await prisma.project.update({
    where: { id: position.project },
    data: {
      skills: updatedSkills,
    },
  });
}

/**
 * Deletes an existing position from the database.
 * @param id, the id of the project to delete.
 */
export async function deletePosition(id: number) {
  // console.log(`deleteProject id: ${id}`);
  const position = await prisma.position.findUnique({ where: { id } });
  if (!position) {
    redirect('/project-list/');
  }
  const project = await prisma.project.findUnique({ where: { id: position.project } });
  if (!project) {
    redirect('/project-list/');
  }
  const updatedPositions = project?.positions.filter(p => p !== id) || [];
  await prisma.project.update({
    where: { id: position.project },
    data: {
      positions: {
        set: updatedPositions,
      },
    },
  });
  await prisma.position.delete({
    where: { id },
  });

  const remainingPositions = await prisma.position.findMany({
    where: { id: { in: updatedPositions } },
  });

  const updatedSkills = Array.from(new Set(remainingPositions.flatMap(p => p.skills)));

  await prisma.project.update({
    where: { id: position.project },
    data: {
      skills: updatedSkills,
    },
  });
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
}) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const { email, password, firstName, lastName } = data;
  const hashedPassword = await hash(password, 10);

  try {
    const key = await keyGen();
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
        username: email.split('@')[0],
        firstName,
        lastName,
        image: '',
        phone: '',
        validcheck: key,
      },
    });

    await sendAutoEmail(
      data.email,
      'Team UHp! verification link.',
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <h1>Team UHp! welcomes you!</h1>
        <br />
        <h3>
          <a href="https://team-uhp.vercel.app/verify/signup?token=${key}">
            Click here to verify your account.
          </a>
        </h3>
        <br />
        <p>If you did not create an account at team-uhp.vercel.app, ignore this email.</p>
        </body>
        </html>`,
    );

    return user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new Error('Email already registered. ');
    }
    throw error;
  }
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
  // console.log(`editUser data: ${JSON.stringify(project, null, 2)}`);
  await prisma.user.update({
    where: { id: credentials.id },
    data: {
      id: credentials.id,
      email: credentials.email,
      username: credentials.username || credentials.email.split('@')[0],
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
 * Deletes an existing user from the database.
 * @param id, the id of the user to delete.
 */
export async function deleteUser(id: number) {
  // console.log(`deleteProject id: ${id}`);
  await prisma.user.delete({
    where: { id },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with: email, oldpassword, password.
 */
export async function changePassword(credentials: {
  email: string;
  oldpassword: string;
  password: string;
}) {
  const { email, oldpassword, password } = credentials;
  const key = await keyGen();

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found.');
  }

  // Check old password
  const isMatch = await compare(oldpassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect.');
  }

  // Updatenew password
  const hashedPassword = await hash(password, 10);
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      validation: true,
      passchgcanx: key,
    },
  });

  await sendAutoEmail(
    user.email,
    'Team UHp! password change notification.',
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Team UHp!</h1>
      <br />
      <h3>
        Your password was recently changed. If you did not make this change,&nbsp;
        <a href="https://team-uhp.vercel.app/verify/passchange?token=${key}">
          click here to lock your account.
        </a>
      </h3>
      <br />
      <p>After locking the account, follow the instructions on screen or click Forgot Password to reset your password.</p>
      </body>
      </html>`,
  );
}

export async function changeForgotPassword(credentials: { email: string, password: string }) {
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user) {
    throw new Error('User not found.');
  }
  const key = await keyGen();
  const hashedPassword = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password: hashedPassword,
      validation: true,
      validpasschg: key,
    },
  });

  await sendAutoEmail(
    user.email,
    'Team UHp! password change notification.',
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Team UHp!</h1>
      <br />
      <h3>
        Your password was recently changed. If you did not make this change,&nbsp;
        <a href="https://team-uhp.vercel.app/verify/passchgcanx?token=${key}">
          click here to lock your account.
        </a>
      </h3>
      <br />
      <p>After locking the account, follow the instructions on screen or click Forgot Password to reset your password.</p>
      </body>
      </html>`,
  );
}

export async function forgotPasswordEmail(email: string) {
  const key = await keyGen();
  await prisma.user.update({
    where: { email },
    data: {
      validation: false,
      validpasschg: key,
    },
  });
  sendAutoEmail(
      email,
      'Team UHp! password change notification.',
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <h1>Team UHp!</h1>
        <br />
        <h3>
          <p>
            You recently requested a password reset.
          </p>
        </h3>
        <br />
        <h3>
          <a href="https://team-uhp.vercel.app/verify/forgotpassword?token=${key}">
            Click here to set a new password.
          </a>
        </h3>
        <br />
        <p>
          If you did not make this request, please use the link above to reset your password.
        </p>
        <br />
        <p>
          If you do not have an account with Team UHp!, please disregard this email.
        </p>
        </body>
        </html>`,
      );
}

export async function forgotUsernameEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found.');
  }

  await sendAutoEmail(
    email,
    'Team UHp! username reminder.',
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Team UHp!</h1>
      <br />
      <h3>
        <p>
          Your Team UHp! username is: ${user.username}.
        </p>
      </h3>
      <p>
        If you did not make this request, please disregard this email.
      </p>
      </body>
      </html>`,
  );
}
