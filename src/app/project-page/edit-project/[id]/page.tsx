import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { userProtectedPage } from '@/lib/page-protection';
import EditProjectForm from '@/components/EditProjectForm';
import { prisma } from '@/lib/prisma';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditProjectFormAny = EditProjectForm as unknown as React.ComponentType<any>;

const EditProject = async ({ params }: { params: Promise<{
  id: number;
}> }) => {

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      members: {
        include: { user: true }
      },
      admins: true,
    }
  });
  if (!project) throw new Error('Project not found');
  
  const session = await getServerSession(authOptions);
  const authUsers: string[] = (await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  })).map(u => u.id.toString());

  const projAdminIds: string[] = project.admins.map((a: { id: number | string }) => a.id.toString());
  authUsers.push(...projAdminIds);

  // Protect the page, only authorized users can access it.
  userProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
    authUsers,
  );

  const members = project.members.map(m => ({ id: m.user.id, name: `${m.user.firstName} ${m.user.lastName}` }));

  const admins = project.admins.map(a => ({ id: a.id, firstName: a.firstName, lastName: a.lastName }));

  return (
    <main>
      <EditProjectFormAny proj={{ id: project.id, image: project.image, title: project.title, descrip: project.descrip, duedate: project.duedate }} members={members} admins={admins} />
    </main>
  );
};

export default EditProject;
