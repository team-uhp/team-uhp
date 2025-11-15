import { PrismaClient, Role, Skills } from '@prisma/client';

import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);

    // eslint-disable-next-line no-await-in-loop
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        username: account.username,
        password,
        role,
        firstName: account.firstName,
        lastName: account.lastName,
        image: account.image,
        phone: account.phone,
        skills: account.skills.map(s => s as Skills) || [],
        availability: account.availability,
        contacts: account.contacts,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  }

  for (const project of config.defaultProject) {
    console.log(`  Adding project: ${JSON.stringify(project)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.project.upsert({
      where: { id: config.defaultProject.indexOf(project) + 1 },
      update: {},
      create: {
        image: project.image,
        title: project.title,
        descrip: project.descrip,
        positions: project.positions,
        members: project.members,
        admins: project.admins,
        duedate: project.duedate,
        skills: project.skills.map(s => s as Skills) || [],
      },
    });
  }

  for (const position of config.defaultPosition) {
    console.log(`   Adding position: ${JSON.stringify(position)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.position.upsert({
      where: { id: config.defaultPosition.indexOf(position) + 1 },
      update: {},
      create: {
        image: position.image,
        title: position.title,
        descrip: position.descrip,
        skills: position.skills.map(s => s as Skills) ?? [],
        datestart: position.datestart,
        dateend: position.dateend,
        project: position['project-id'],
        admins: position.admins,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
