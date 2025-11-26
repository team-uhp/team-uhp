import React from 'react';
import { Project } from '@prisma/client';
import Link from 'next/link';
import { Badge, Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';

/* Renders a single row in the Projects list. See project-list/page.tsx. */
const ProjectCard = ({ project }: { project: Project }) => {
  const date = new Date(project.duedate);
  const day = date.getDate().toString().padStart(2, '0');
  const mon = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const imgPath = `/${project.image}`;
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
                <div style={{ width: '75px', height: '75px', position: 'relative' }}>
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
                <Col id="proj-title" className="truncate-text">
                  <h1>{project.title}</h1>
                  <h6>
                    Due date:&nbsp;
                    {mon}
                    /
                    {day}
                    /
                    {year}
                  </h6>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <CardText id="proj-descrip" className="truncate-text">
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
