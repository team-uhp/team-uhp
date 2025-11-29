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

  const project = await prisma.project.findUnique({
    where: { id: Number(params.id) },
    include: { members: true, positions: true },
  });
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
        <div style={{ height: '200px', position: 'relative', width: '100%' }}>
          {project.image && project.image.trim() !== '/' ? (
            <Image
              src={imgPath}
              alt={project.title}
              fill
              style={{ objectFit: 'contain' }}
              sizes="75px"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#e0e0e0',
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

      <Row className="mt-3">
        <h6>
          Due date:&nbsp;{day}/{mon}/{year}
        </h6>
      </Row>

      <Row className="mt-2">
        <h5>
          Description:&nbsp;{project.descrip}
        </h5>
      </Row>

      <Container id="project-members" fluid className="my-3">
        <h6>Members:</h6>
        {Array.isArray(project.members) && project.members.length > 0 ? (
          project.members.map((member) => (
            <MemberName
              key={`User-${typeof member === 'object' ? (member.id ?? '') : member}`}
              userid={typeof member === 'object' ? (member.id as number) : (member as number)}
            />
          ))
        ) : (
          <div>No members listed.</div>
        )}
      </Container>

      <Container id="project-openings" fluid className="my-3">
        <h6>Openings:</h6>
        {Array.isArray(project.positions) && project.positions.length > 0 ? (
          project.positions.map((opening) => (
            <OpeningTitle
              key={`Position-${typeof opening === 'object' ? (opening.id ?? '') : opening}`}
              openingid={typeof opening === 'object' ? (opening.id as number) : (opening as number)}
            />
          ))
        ) : (
          'Currently no openings available.'
        )}
      </Container>

      <div className="mt-3">Looking for Skills:</div>
      <Container id="project-tags" fluid className="mt-2">
        {Array.isArray(project.skills) && project.skills.length > 0 ? (
          project.skills.map((tag) => (
            <Badge className="mx-1" key={tag} bg="info">
              {tag}
            </Badge>
          ))
        ) : (
          <div>No skills listed.</div>
        )}
      </Container>
    </Container>
  );
};

export default ProjectInfo;
