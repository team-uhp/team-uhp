import { prisma } from '@/lib/prisma';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import { Project, User } from '@prisma/client';
import ProjectCard from './ProjectCard';

/** Renders the information page for a Project. */
const UserProfile = async ({ user }: { user: User }) => {
  // Check if the user is a member of any projects
  const projects: Project[] = await prisma.project.findMany({
    where: {
      members: { has: user.id },
    } });

  // Get profile picture path
  const imgPath = `/${user.image}`;

  return (
    <Row>
      <Col lg={3}>
        <Image
          src={imgPath}
          alt={`${user.firstName} ${user.lastName}`}
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
        />
        <h1>
          {user.firstName}
          &nbsp;
          {user.lastName}
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
          {user.skills.join(', ')}
        </h6>
      </Col>
      <Col lg={9}>
        <Row>
          <h2>Projects</h2>
          {projects.map((project) => (
            <ProjectCard
              key={user.id}
              project={project}
            />
          ))}
        </Row>
      </Col>
      <Col>
        <Button variant="primary" href={`/edit-user/${user.id}`}>Edit Profile</Button>
      </Col>
    </Row>
  );
};

export default UserProfile;
