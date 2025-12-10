import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import React from 'react';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import { Project, User, Position } from '@prisma/client';
import UserProjectCard from './UserProjectCard';
import ContactButton from '@/components/ContactButton';
import { splitCamelCase } from '@/utilities/format';

type ProjectWithPositions = Project & { positions: Position[] };
type UserWithContacts = User & { contacts: User[] };


/** Renders the information page for a Project. */
const UserProfile = async ({ user }: { user: UserWithContacts }) => {
  const session = await getServerSession(authOptions) as {
    user: { email: string; id: string; randomKey: string };
  } | null;

  // Check if the user is a member of any projects
  const projects: ProjectWithPositions[] = await prisma.project.findMany({
    where: {
      members: { some: { userId: user.id } },
    },
    include: {
      positions: true,
    },
  });

  const sessionUserId = Number(session?.user.id);

  const sessionUser = await prisma.user.findUnique({
    where: { id: sessionUserId },
    include: { contacts: true },
  });

  const isInitiallyContact = sessionUser?.contacts.some(c => c.id === user.id) ?? false;

  // Get profile picture path

  return (
    <Row>
      <Col lg={3}>
        <img
          src={user.image && user.image.trim() !== "" ? user.image : "/default-profile.jpg"}
          alt={`${user.firstName} ${user.lastName}`}
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
        />
        <h1 style={{ wordWrap: 'break-word', marginTop: '20px' }}>
          {`${user.firstName} ${user.lastName}`}
        </h1>
        <h6>
          Username:&nbsp;
          {user.username}
        </h6>
        <h6>
          Email:&nbsp;
          {user.email}
        </h6>
        <h6>
          Role:&nbsp;
          <Badge bg="info" text="dark">
            {user.role}
          </Badge>
        </h6>
        <h6>
          Skills:&nbsp;
          {user.skills.map(skill => splitCamelCase(skill)).join(', ')}
        </h6>
        {sessionUserId !== user.id && (
          <ContactButton
            isInitiallyContact={isInitiallyContact}
            currentUserId={sessionUserId}
            profileId={user.id}
          />
        )}
      </Col>
      <Col lg={9} className='px-3'>
        <h2 className="mb-4">Projects</h2>
          <Row className="g-4">
            {projects.length === 0 && (
              <p>This user is not part of any projects.</p>
            )}

            {projects.map((project) => (
              <Col key={project.id} xs={12} md={6} lg={6}>
                <UserProjectCard project={project} />
              </Col>
            ))}
          </Row>
      </Col>
      <Col>
        {
          session && Number(session.user.id) === user.id && (
            <Button style={{backgroundColor: '#0e4f6cff', borderColor:'#0e4f6cff', marginTop: '10px' }} href={`/edit-profile/${user.id}`}>Edit Profile</Button>
          )
        }
      </Col>
    </Row>
  );
};

export default UserProfile;
