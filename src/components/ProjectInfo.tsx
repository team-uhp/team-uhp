import { prisma } from '@/lib/prisma';
import { ComponentIDs } from '@/utilities/ids';
import { notFound } from 'next/navigation';
import { Badge, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import MemberName from './MemberName';

/** Renders the information page for a Project. */
const ProjectInfo = async ({ params }: { params: { id: string; } }) => {
  const projectId = parseInt(params.id, 10);
  if (Number.isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    notFound();
  }

  const date = new Date(project.duedate);
  const day = date.getDate().toString().padStart(2, '0');
  const mon = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const imgPath = `/${project.image}`;
  return (
    <Container id={ComponentIDs.projectInfo} className="py-3">
      <Row className="justify-content-center">
        <div style={{ height: '200px', position: 'relative' }}>
          {project.image && project.image.trim() !== '/' ? (
            <Image
              src={imgPath}
              alt={project.title}
              fill
              style={{ objectFit: 'contain' }}
              sizes="75px"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#888',
            }}
            >
              No Image
            </div>
          )}
        </div>
        <h1>
          Project:&nbsp;
          {project.title}
        </h1>
      </Row>
      <Row>
        <h6>
          Due date:&nbsp;
          {day}
          /
          {mon}
          /
          {year}
        </h6>
        <br />
        <br />
        <h5>
          Description:&nbsp;
          {project.descrip}
        </h5>
      </Row>
      Meet the Team:
      <Container id="project-members" fluid>
        {project.members.map((member) => (
          <MemberName key={`User-${member}`} userid={member} />
        ))}
      </Container>
      Looking for Skills:
      <Container id="project-tags" fluid>
        {project.skills.map((tag) => (
          <Badge
            className="mx-1"
            key={tag}
            bg="info"
          >
            {tag}
          </Badge>
        ))}
      </Container>
    </Container>
  );
};

export default ProjectInfo;
