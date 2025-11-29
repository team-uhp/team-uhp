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
      <Container id="list" className="py-3">
        <Row>
          <Col>
            <h1>List Projects Admin</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id #</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Image</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <ProjectsList key={project.id} {...project} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ProjectsAdminPage;
