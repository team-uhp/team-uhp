import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import ProjectCard from '@/components/ProjectCard';
import { PageIDs } from '@/utilities/ids';
import Link from 'next/link';

/** Render a list of projects for the logged in user. */
const ProjectListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const projects = await prisma.project.findMany();
  // console.log(project);
  return (
    <Container id={PageIDs.projectsList} fluid className="py-3">
      <Row>
        <Col>
          <h2 className="text-center">Projects List</h2>
          <Link
            href="/add-project/"
          >
            Add Project
          </Link>
          <br />
          <br />
          <Row className="g-4">
            {projects.map((project) => (
              <ProjectCard key={`Project-${project.id}`} project={project} />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectListPage;
