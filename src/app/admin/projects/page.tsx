import React from 'react';
import { getServerSession } from 'next-auth';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import ProjectsList from '@/components/ProjectsList';

const ProjectsAdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const projects = await prisma.project.findMany({});

  return (
    <main>
      <Container fluid id="list" className="py-3">
        <Row className="justify-content-center">
          <Col lg={11}>
            <h1>List Projects Admin</h1>
            {/* Wrap table in scrollable div */}
            <div style={{ overflowY: 'scroll', overflowX: 'auto', height: '65vh' }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>Id #</th>
                    <th style={{ width: '150px' }}>Title</th>
                    <th style={{ maxWidth: '300px', wordBreak: 'break-word' }}>Description</th>
                    <th style={{ width: '120px' }}>Due Date</th>
                    <th style={{ width: '100px' }}>Image</th>
                    <th style={{ width: '80px' }}>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <ProjectsList key={project.id} {...project} />
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProjectsAdminPage;
