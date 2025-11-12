import { prisma } from '@/lib/prisma';
import { ComponentIDs } from '@/utilities/ids';
import { notFound } from 'next/navigation';
import { Badge, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import MemberName from './MemberName';

/** Renders the information page for a Project. */
const OpeningInfo = async ({ params }: { params: { id: number; } }) => {
  if (Number.isNaN(Number(params.id))) {
    notFound();
  }

  const position = await prisma.position.findUnique({ where: { id: Number(params.id) } });
  if (!position) {
    notFound();
  }

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
      <Row className="justify-content-center">
        <div style={{ height: '200px', position: 'relative' }}>
          {position.image && position.image.trim() !== '/' ? (
            <Image
              src={imgPath}
              alt={position.title}
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
        <h1>
          Project:&nbsp;
          {position.title}
        </h1>
      </Row>
      <Row>
        <h6>
          Start date:&nbsp;
          {smon}
          /
          {sday}
          /
          {syear}
        </h6>
        <h6>
          End date:&nbsp;
          {emon}
          /
          {eday}
          /
          {eyear}
        </h6>
        <br />
        <br />
        <h5>
          Description:&nbsp;
          {position.descrip}
        </h5>
      </Row>
      Position Opening:
      <Container id="project-members" fluid>
        {position.member !== null ? (
          <MemberName key={`User-${position.member}`} userid={position.member} />
        ) : (
          <Link href="/">Apply for opening</Link>
        )}
      </Container>
      Looking for Skills:
      <Container id="project-tags" fluid>
        {position.skills.map((tag) => (
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

export default OpeningInfo;
