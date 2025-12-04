import React from 'react';
import { Badge } from 'react-bootstrap';
import { Project, Position } from '@prisma/client';
import Link from 'next/link';

type ProjectWithPositions = Project & { positions: Position[] };

const UserProjectCard = ({ project }: { project: ProjectWithPositions }) => {
  const formatDate = (input: string | Date) =>
    new Date(input).toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });

  const today = new Date();
  const dueDate = new Date(project.duedate);

  return (
    <div
      className="shadow-sm card"
      style={{
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        border: '1px solid #D9D9D9',
      }}
    >
      {/* Header */}
      <div
        className="card-header text-center"
        style={{
          backgroundColor: '#000000',
          color: 'white',
          fontWeight: 600,
          borderRadius: '6px 6px 0 0',
        }}
      >
        {project.title}
      </div>

      <div className="card-body">
        {/* Project Image */}
        {project.image && (
          <div className="text-center mb-3">
            <img
              src={`${project.image}`}
              alt={project.title}
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        {/* Open For Range */}
        <p
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#000000',
          }}
        >
          <span>Open For:</span>{' '}
          {formatDate(today)} — {formatDate(dueDate)}
        </p>

        {/* Description */}
        <p style={{ fontSize: '0.9rem', color: '#333333' }}>
          {project.descrip?.length > 180
            ? project.descrip.slice(0, 180) + '…'
            : project.descrip}
        </p>

        {/* Skills */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {project.positions.flatMap((pos) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
            pos.skills.map((skill) => (
              <Badge
                key={`${project.id}-${skill}`}
                bg="info"               // ✔ matches screenshot blue
                text="light"
                className="px-2 py-1"
                style={{ borderRadius: '5px' }}
              >
                {skill}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="card-footer text-center"
        style={{
          backgroundColor: '#FFFFFF',   // ✔ white footer
          borderTop: '1px solid #D9D9D9',
        }}
      >
        <Link
          href={`/project-page/${project.id}`}
          className="btn btn-sm"
          style={{
            backgroundColor: '#003b4c',
            color: 'white',
            fontWeight: 500,
            borderRadius: '6px',
          }}
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

export default UserProjectCard;
