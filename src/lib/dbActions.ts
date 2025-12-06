'use server';

import { hash, compare } from 'bcrypt';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Role, Skills } from '@prisma/client';
import { prisma } from './prisma';
import authOptions from './authOptions';
import sendAutoEmail from './email';
import keyGen from './keygen';
import { revalidatePath } from 'next/cache';

/**
 * Adds a new project to the database.
 * @param project, an object with the following
 * properties: image, title, descrip, duedate,
 * members, admins.
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
      duedate: project.duedate || new Date().toISOString(),
      members: {
        create: [{
          user: { connect: { id: userId } },
          role: 'admin',
        }],
      },
      admins: {
        connect: [{ id: userId }],
      },
    },
  });
}

/**
 * Edits an existing project in the database.
 * @param project, an object with the following
 * properties: id, image, title, descrip,
 * positions, members, admins, duedate.
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
}) {
  // console.log(`editProject data: ${JSON.stringify(project, null, 2)}`);

  await prisma.$transaction(async (tx) => {
    const currentMembers = await tx.projectMembers.findMany({
      where: { projectId: project.id },
      select: { userId: true },
    });

    const currentMembersId = currentMembers.map(m => m.userId);
    const newMembersId = project.members || [];

    const addMembers = newMembersId.filter(id => !currentMembersId.includes(id));
    const removeMembers = currentMembersId.filter(id => !newMembersId.includes(id));

    if (removeMembers.length > 0) {
      await tx.projectMembers.deleteMany({
        where: {
          projectId: project.id,
          userId: { in: removeMembers },
        },
      });
    }
    if (addMembers.length > 0) {
      await tx.project.update({
        where: { id: project.id },
        data: {
          image: project.image,
          title: project.title,
          descrip: project.descrip,
          members: {
            create: addMembers.map(userId => ({
              user: { connect: { id: userId } },
              role: 'member',
            })),
          },
          admins: {
            set: (project.admins || []).map((id) => ({ id })),
          },
          duedate: project.duedate,
        }
      });
    } else {
      await tx.project.update({
        where: { id: project.id },
        data: {
          image: project.image,
          title: project.title,
          descrip: project.descrip,
          admins: {
            set: (project.admins || []).map((id) => ({ id })),
          },
          duedate: project.duedate,
        }
      });
    }
  })
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
  project: number,
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('No authenticated user');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('User not found');

  const userId = user.id;

  const posit = await prisma.position.create({
    data: {
      image: position.image,
      title: position.title,
      descrip: position.descrip,
      skills: position.skills,
      datestart: position.datestart,
      dateend: position.dateend,
      admins: { connect: [{ id: userId }] },
      project: { connect: { id: position.project } },
    },
  });

  const projectData = await prisma.project.findUnique({
    where: { id: position.project },
  });

  const setSkills = Array.from(new Set([...(projectData?.skills || []), ...posit.skills]));

  await prisma.project.update({
    where: { id: position.project },
    data: {
      positions: {
        connect: { id: posit.id },
      },
      skills: setSkills,
    },
  });

  return posit;
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
      image: position.image,
      title: position.title,
      descrip: position.descrip,
      skills: position.skills,
      datestart: position.datestart,
      dateend: position.dateend,
      project: { connect: { id: position.project } },
      admins: { set: position.admins.map((id) => ({ id })) },
      member: position.member ? { connect: { id: position.member } } : { disconnect: true },
    },
  });

  const project = await prisma.project.findUnique({ where: { id: position.project }, include: { positions: true } });
  if (!project) {
    redirect('/project-list/');
  }

  const remainingPositions = await prisma.position.findMany({});

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
  
    if (position.projectId == null) {
      redirect('/project-list/');
    }
  
    const project = await prisma.project.findUnique({ where: { id: position.projectId }, include: { positions: true } });
    if (!project) {
      redirect('/project-list/');
    }
    const updatedPositions = (project.positions || []).map(p => p.id).filter(pid => pid !== id);
    await prisma.project.update({
      where: { id: position.projectId },
      data: {
        positions: {
          set: updatedPositions.map(pid => ({ id: pid })),
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
      where: { id: position.projectId },
      data: {
        skills: updatedSkills,
      },
    });
}

/**
 * Creates an application for a position.
 * @param applic, an object with the following
 * properties: userid, positionid, application.
 */
export async function applyCreate(applic: {
  userId: number,
  positionId: number,
  application: string,
}) {
  // console.log(`applyCreate data: ${JSON.stringify(application, null, 2)}`);
  const position = await prisma.position.findUnique({ where: { id: applic.positionId } });
  if (!position) throw new Error('Position not found');
  
  const user = await prisma.user.findUnique({ where: { id: applic.userId } });
  if (!user) throw new Error('User not found');

  const app = await prisma.application.create({
    data: {
      user: { connect: { id: applic.userId } },
      position: { connect: { id: applic.positionId } },
      application: applic.application,
    },
  });
  if (!app) throw new Error('Application failed');

  await prisma.position.update({
    where: { id: applic.positionId },
    data: {
      applics: { connect: [{ id: app.id }] },
    }
  });

  if (position.projectId != null) {
    const project = await prisma.project.findUnique({
      where: { id: position.projectId },
      include: { admins: true },
    });

    if (project && project.admins && project.admins.length > 0) {
      await Promise.all(project.admins.map(async (admUser) => {
        if (!admUser?.email) return;
        await sendAutoEmail(
          admUser.email,
          `Received ${project.title} application`,
          `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body>
            <h1>Application received for project ${project.title}!</h1>
            <br />
            <h3>
              <a href="https://team-uhp.vercel.app/project-opening/${project.id}">
                Click here to view the project and a link to the application.
              </a>
            </h3>
            <br />
            <p>If you are not an admin of this project at team-uhp.vercel.app, ignore this email.</p>
            </body>
            </html>`,
        );
      }));
    }
  }
}

/**
 * Edits an application for a position.
 * @param applic, an object with the following
 * properties: id, application.
 */
export async function applyEdit(applic: {
  id: number,
  application: string,
}) {
  // console.log(`applyEdit data: ${JSON.stringify(applic, null, 2)}`);
  await prisma.application.update({
    where: { id: applic.id },
    data: {
      application: applic.application,
    },
  });
}

/**
 * Accepts an application for a position.
 * @param applic, the application ID number.
 */
export async function applyAccept(applic: { applicId: number,
}) {
  // console.log(`applyAccept data: ${JSON.stringify(application, null, 2)}`);
  const application = await prisma.application.findUnique({ where: { id: applic.applicId } });
  if (!application) throw new Error ('Application not found');

  if (application.userId == null) throw new Error ('Application is not associated with user.');

  const user = await prisma.user.findUnique({ where: { id: application.userId }});
  if (!user) throw new Error ('Position not found');

  if (application.positionId == null) throw new Error ('Application is not associated with position');

  const position = await prisma.position.findUnique({ where: { id: application.positionId } });
  if (!position) throw new Error ('Project not found');

  if (position.projectId == null) throw new Error ('Position is not associated with a project.');

  const project = await prisma.project.findUnique({ where: { id: Number(position.projectId) }, include: { positions: true } });
  if (!project) throw new Error('Project not found');

  if (application.userId == null) throw new Error('Application is not associated with a user.');

  const member = await prisma.projectMembers.findUnique({
    where: {
      userId_projectId: {
        userId: application.userId!,
        projectId: Number(position.projectId),
      }
    }
  });

  if (!member) {
    await prisma.projectMembers.create({
      data: {
        userId: application.userId!,
        projectId: Number(position.projectId),
        role: 'member',
      },
    });
  }

  await prisma.position.update({
    where: { id: application.positionId },
    data: {
      member: { connect: { id: application.userId } },
      skills: [],
    },
  });

  const updatedPositions = (project.positions || []).map(p => p.id).filter(pid => pid !== position.id);
  await prisma.project.update({
    where: { id: Number(position.projectId) },
    data: {
      positions: {
        set: updatedPositions.map(pid => ({ id: pid })),
      },
    },
  });
  
  const remainingPositions = await prisma.position.findMany({
    where: { id: { in: updatedPositions } },
  });
  
  const updatedSkills = Array.from(new Set(remainingPositions.flatMap(p => p.skills)));
  
  await prisma.project.update({
    where: { id: project.id },
    data: {
      skills: updatedSkills,
    },
  });

  await sendAutoEmail(
    user.email,
    `${position.title} application accepted!`,
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Your application for ${position.title} was accepted!</h1>
      <br />
      <h3>
        <a href="https://team-uhp.vercel.app/project-opening/${position.projectId}">
          Click here to view the project.
        </a>
      </h3>
      <br />
      <p>If you did not apply for this project at team-uhp.vercel.app, ignore this email.</p>
      </body>
      </html>`,
  );
}

/**
 * Deletes an existing application in the database.
 * @param applic, the application ID number.
 */
export async function applyDelete(applic: {
  applicId: number,
}) {
  // console.log(`applyDelete data: ${JSON.stringify(application, null, 2)}`);
  await prisma.application.delete({ where: { id: applic.applicId } });
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
    let baseUsername = "";
    
    if (email && email.includes("@")) {
      baseUsername = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "");
    }

    if (!baseUsername && firstName) {
      baseUsername = firstName.toLowerCase().replace(/[^a-z0-9]/gi, "");
    }

    if(!baseUsername) {
      baseUsername = "user";
    }

    let finalUsername = baseUsername;
    let counter = 1;

    while (true) {
      const existing = await prisma.user.findUnique({
        where: { username: finalUsername },
      });
      if (!existing) break;
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    const key = await keyGen();
    const user = await prisma.user.create({
      data: {
        email,
        username: finalUsername,
        password: hashedPassword,
        role: 'USER',
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
      email: credentials.email,
      username: credentials.username || credentials.email.split('@')[0],
      password: credentials.password,
      role: credentials.role,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      image: credentials.image,
      phone: credentials.phone,
      skills: credentials.skills,
      contacts: {
        set: credentials.contacts.map((id) => ({ id })),
      },
      availability: { set: credentials.availability },
    },
  });
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

  redirect('/home');
}

export async function forgotPasswordEmail(email: string) {
  const key = await keyGen();
  await prisma.user.update({
    where: { email: email },
    data: {
      validation: false,
      validpasschg: key,
    },
  });
  await sendAutoEmail(
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
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { username: true },
  });

  if (!user) return;

  await sendAutoEmail(
    email,
    'Team UHp! Username Reminder',
    `<!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h1>Team UHp!</h1>
          <p>Your username is:</p>
          <h2>${user.username}</h2>

          <p>If you did not make this request, please ignore this email.</p>
        </body>
      </html>`
  );
}

export async function changeUserRole(userId: number) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newRole: Role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin/users');
  } catch (error) {
    console.error('Failed to change role', error);
  }
}
