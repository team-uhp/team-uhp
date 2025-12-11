import React from 'react';
import NotFound from '@/app/not-found';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import ApplicationAdmin from '@/components/ApplicationAdmin';
import ApplicationUser from '@/components/ApplicationUser';

/**
 * Page for viewing a single application for a project opening.
 * Only the applicant or project admins (or global ADMIN) can see it.
 */
const ApplicationPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const session = await getServerSession(authOptions) as {
    user: { email: string; id: string; randomKey: string };
  } | null;

  if (!session) return NotFound();

  loggedInProtectedPage(session);

  const currentUser = await prisma.user.findUnique({ where: { id: Number(session.user.id) } });
  if (!currentUser) return NotFound();

  const resolvedParams = await params;

  const applic = await prisma.application.findUnique({
    where: { id: Number(resolvedParams.id) },
    include: {
      user: true,
      position: {
        include: {
          applics: { include: { user: true } },
          admins: true,
          project: true,
        },
      },
    },
  });

  if (!applic || !applic.position || !applic.user) return NotFound();

  const applicantUser = applic.user;

  if (applicantUser.id === currentUser.id) {
    return (
      <Container style={{ marginTop: '25px' }}>
          <Link
            href={`/project-opening/${applic.position.project?.id ?? ''}`}
            style={{ color: '#111613', textDecoration: 'underline' }}
          >
            &lt;&nbsp;Back to Opening
          </Link>
        <ApplicationUser
          user={applicantUser}
          applic={{
            ...applic,
            projId: applic.position?.project?.id ?? 0,
            application: applic.application ?? '',
          }}
        />
      </Container>
    );
    } else if (
      (applic.position.admins?.some((a) => a.id === currentUser.id) ?? false) ||
      currentUser.role === 'ADMIN'
    ) {
        return (
          <Container style={{ marginTop: '25px' }}>
              <Link
                href={`/project-opening/${applic.position.project?.id ?? ''}`}
                style={{ color: '#111613', textDecoration: 'underline' }}
              >
                  &lt;&nbsp;Back to Opening
              </Link>
            <ApplicationAdmin
              user={applicantUser}
              applic={{
                ...applic,
                projId: applic.position?.project?.id ?? 0,
                application: applic.application ?? '',
              }}
            />
          </Container>
        );
      }
      return (
        <Container style={{ marginTop: '25px' }}>
          <Link href={`/project-page/${applic.position.id ?? ''}`}>&lt;Back to Position</Link>
          <h1>Permissions denied.</h1>
          <h2>You do not have permissions to view this application.</h2>
        </Container>
      );
    };

export default ApplicationPage;
