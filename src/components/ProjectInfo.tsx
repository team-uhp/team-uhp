import React from 'react';
import { prisma } from '@/lib/prisma';
import { ComponentIDs } from '@/utilities/ids';
import { notFound } from 'next/navigation';
import { Badge, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import MemberName from './MemberName';
import OpeningTitle from './OpeningTitle';

/** Renders the information page for a Project. */
const ProjectInfo = async ({ params }: { params: { id: number } }) => {
  if (Number.isNaN(Number(params.id))) {
    notFound();
  }

  const project = await prisma.project.findUnique({ where: { id: Number(params.id) } });
  if (!project) {
    notFound();
  }

  const date = new Date(project.duedate);
  const day = date.getDate().toString().padStart(2, '0');
  const mon = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const imgPath = `/${project.image}`;
  return (
    <Container id={ComponentIDs.projectInfo} className="py-3" >
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
              fontSize: '48px',
              color: '#888',
            }}
            >
              No Image Provided
            </div>
          )}
        </div>
        <h1 className="title">
          Project:&nbsp;
          {project.title}
        </h1>
      </Row> 
      <Row>
        <h6 style={{ marginBottom: '20px' }}>
          Due Date:&nbsp;
          {day}/{mon}/{year}
        </h6>
          <strong>Project Description: </strong>
          <Container className="body">{project.descrip}</Container>
      </Row>
      <strong>Meet the Team:</strong>
      <Container id="project-members">
        {project.members.map((member) => (
          <MemberName
            key={`User-${member}`}
            userid={member}
          />
        ))}
      </Container>
      <strong>Project Openings: </strong>
      {project.positions}
      <Container id="project-openings">
        {Array.isArray(project.positions) && project.positions.length > 0 ? (
          project.positions.map((opening) => (
            <OpeningTitle key={`Position-${opening}`} openingid={opening} />
          ))
        ) : (
          'Currently no openings available.'
        )}
      </Container>
      <strong>Looking for Skills: </strong>
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
