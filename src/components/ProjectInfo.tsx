import React from 'react';
import { prisma } from '@/lib/prisma';
import { ComponentIDs } from '@/utilities/ids';
import { notFound } from 'next/navigation';
import { Badge, Container, Row, Col } from 'react-bootstrap';
import MemberName from './MemberName';
import OpeningTitle from './OpeningTitle';
import { splitCamelCase } from '@/utilities/format';

/** Renders the information page for a Project. */
const ProjectInfo = async ({ params }: { params: { id: number } }) => {
  if (Number.isNaN(Number(params.id))) notFound();

  const project = await prisma.project.findUnique({
    where: { id: Number(params.id) },
    include: { members: true, positions: true },
  });
  if (!project) notFound();

  const date = new Date(project.duedate);
  const day = date.getDate().toString().padStart(2, '0');
  const mon = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return (
    <Container id={ComponentIDs.projectInfo} className="py-3">
      {/* Project Image and Title */}
      <Row>
       {project.image && project.image.trim() !== '' && (
        <div style={{ width: '100%', marginBottom: '15px' }}>
          <img
            src={project.image}
            alt={project.title}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
        <h1
          className="title mt-2"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1.8rem',
            marginBottom: '0.5rem'
          }}
        >
          {project.title}
        </h1>
        <h6>
          <strong>Due Date:</strong>&nbsp; {mon}/{day}/{year}
        </h6>
      </Row>

      {/* Description */}
      <Row className="mt-3" >
        <Col>
          <strong>Description:</strong>
          <div
            id="proj-descrip"
            style={{
              whiteSpace: 'pre-line',
              marginTop: '0.5rem',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
          >
            {project.descrip}
          </div>
        </Col>
      </Row>

      {/* Members */}
      <Container id="project-members" fluid className="my-3">
        <Row>
          <strong>Members:</strong>
        </Row>
        <Row>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' }}>
            {Array.isArray(project.members) && project.members.length > 0 ? (
              project.members.map((member) => (
                <div key={`User-${typeof member === 'object' ? member.id ?? '' : member}`} className="mb-2">
                  <MemberName
                    userid={typeof member === 'object' ? member.userId as number : member as number}
                  />
                </div>
              ))
            ) : (
              <div>No members listed.</div>
            )}
          </div>
        </Row>
      </Container>

      {/* Openings */}
      <Container id="project-openings" fluid className="my-3">
        <Row>
          <strong>Openings:</strong>
        </Row>
        <Row>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap' }}>
            {Array.isArray(project.positions) && project.positions.length > 0 ? (
              project.positions.map((opening) => (
                <div key={`Position-${typeof opening === 'object' ? opening.id ?? '' : opening}`} className="mb-2">
                  <OpeningTitle
                    openingid={typeof opening === 'object' ? opening.id as number : opening as number}
                  />
                </div>
              ))
            ) : (
              <div>Currently no openings available.</div>
            )}
          </div>
        </Row>
      </Container>

      {/* Skills */}
      <Container id="project-tags" fluid className="mt-3">
        <strong>Looking for Skills:</strong>
        <div style={{ marginTop: '0.5rem' }}>
          {Array.isArray(project.skills) && project.skills.length > 0 ? (
            project.skills.map((tag) => (
              <Badge className="mx-1" key={tag} bg="info">
                {splitCamelCase(tag)}
              </Badge>
            ))
          ) : (
            <div>No skills listed.</div>
          )}
        </div>
      </Container>
    </Container>
  );
};

export default ProjectInfo;
