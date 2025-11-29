import React from 'react';
import { prisma } from '@/lib/prisma';
import { ComponentIDs } from '@/utilities/ids';
import { notFound } from 'next/navigation';
import { Badge, Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import MemberName from './MemberName';

/** Renders the information page for a Position/Opening. */
const OpeningInfo = async ({ params }: { params: { id: number } }) => {
  if (Number.isNaN(Number(params.id))) notFound();

  const position = await prisma.position.findUnique({ 
    where: { id: Number(params.id) },
    include: { 
      project: { select: { id: true, title: true } } 
    }
   });
   
  if (!position) notFound();

  const sdate = new Date(position.datestart);
  const edate = new Date(position.dateend);
  const sday = sdate.getDate().toString().padStart(2, '0');
  const smon = (sdate.getMonth() + 1).toString().padStart(2, '0');
  const syear = sdate.getFullYear();
  const eday = edate.getDate().toString().padStart(2, '0');
  const emon = (edate.getMonth() + 1).toString().padStart(2, '0');
  const eyear = edate.getFullYear();

  const imgPath = `/${position.image}`;

  return (
    <Container id={ComponentIDs.projectInfo} className="py-3">
      {/* Position Image and Title */}
      <Row className="justify-content-center">
        <div style={{ height: '200px', position: 'relative', width: '100%', marginBottom: '15px' }}>
          {position.image && position.image.trim() !== '/' ? (
            <Image
              src={imgPath}
              alt={position.title}
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
        <h1
          className="title mt-2"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1.8rem',
            marginBottom: '0.5rem'
          }}
        >
          {position.title}
        </h1>
         {position.project && (
          <h5 style={{ fontWeight: 400, color: '#555', marginBottom: '0.5rem' }}>
            Project: <Link href={`/project-page/${position.project.id}`} style={{ color: '#008091' }}>
              {position.project.title}
            </Link>
          </h5>
        )}
      </Row>

      {/* Dates */}
      <Row className="mt-3">
        <Col>
          <h6><strong>Start Date:</strong> {smon}/{sday}/{syear}</h6>
          <h6><strong>End Date:</strong> {emon}/{eday}/{eyear}</h6>
        </Col>
      </Row>

      {/* Description */}
      <Row className="mt-3">
        <Col>
          <strong>Description:</strong>
          <div style={{ whiteSpace: 'pre-line', marginTop: '0.5rem' }}>
            {position.descrip}
          </div>
        </Col>
      </Row>

      {/* Assigned Member / Apply Link */}
      <Row className="mt-3">
        <Col>
          <strong>Position Opening:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {position.memberId ? (
              <MemberName key={`User-${position.memberId}`} userid={position.memberId} />
            ) : (
              <Link href={`/project-opening/apply-opening/${position.id}?id=${position.id}`}>
                Apply for this opening
              </Link>
            )}
          </div>
        </Col>
      </Row>

      {/* Skills */}
      <Row className="mt-3">
        <Col>
          <strong>Looking for Skills:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {position.skills.length > 0 ? (
              position.skills.map((tag) => (
                <Badge className="mx-1" key={tag} bg="info">
                  {tag}
                </Badge>
              ))
            ) : (
              <div>No skills listed.</div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OpeningInfo;
