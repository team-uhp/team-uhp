import React from 'react';
import { Project, Position } from '@prisma/client';
import Link from 'next/link';
import { Badge, Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, Row } from 'react-bootstrap';

/* Renders a single row in the Projects list. See project-list/page.tsx. */

type ProjectWithPositions = Project & { positions: Position[] };

const ProjectCard = ({ project }: { project: ProjectWithPositions }) => {
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
                <div style={{ width: '75px', height: '75px', position: 'relative' }}>
                  {project.image && project.image.trim() !== '/' ? (
                    <img
                      src={`${project.image}`}
                      alt={project.title}
                      width={75}
                      height={75}
                      sizes="75px"
                      style={{ objectFit: 'cover' }}
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
               <Col style={{ paddingLeft: '15px' }}>
                 <h4
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem',
                      color: '#008091',
                    }}
                  >
                    {project.title}
                  </h4>
                  <h6 style={{ fontSize: '0.95rem', fontWeight: 400, color: '#555' }}>
                    Due date:&nbsp;{mon}/{day}/{year}
                  </h6>
               </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <CardText
                id="proj-descrip"
                style={{ whiteSpace: 'pre-line' }}
              >
                {project.descrip.length > 650
                  ? project.descrip.slice(0, 650) + '...'
                  : project.descrip}
              </CardText>
              {/* Openings */}
              {Array.isArray(project.positions) && project.positions.length > 0 ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Openings:</strong>
                  <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                    {project.positions.map((opening) => (
                      <li key={opening.id}>{opening.title}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                  No openings listed.
                </div>
              )}
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
