import { Project } from '@prisma/client';
import Link from 'next/link';
import { Badge, Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, Image, Row } from 'react-bootstrap';

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const ProjectCard = ({ project }: { project: Project }) => {
  const date = new Date(project.duedate);
  const day = date.getDate().toString().padStart(2, '0');
  const mon = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return (
    <Container className="py-3">
      <Row className="justify-content-start">
        <Link
          href={`/project-page/${project.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Card>
            <CardHeader>
              <Row className="mx-auto g-0">
                <div style={{ width: '75px', height: '75px' }}>
                  <Image
                    src={project.image ? project.image : ''}
                    alt={project.title}
                    fluid
                  />
                </div>
                <Col id="proj-title">
                  <h1>{project.title}</h1>
                  <h6>
                    Due date:&nbsp;
                    {day}
                    /
                    {mon}
                    /
                    {year}
                  </h6>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <CardText id="proj-descrip">
                {project.descrip}
              </CardText>
            </CardBody>
            <CardFooter className="flex gap-2 flex-wrap">
              {project.skills.map((tag) => (
                <Badge
                  className="mx-1"
                  key={tag}
                  bg="info"
                >
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </Link>
      </Row>
    </Container>
  );
};

export default ProjectCard;
