import ProjectInfo from '@/components/ProjectInfo';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';

/**
 * Renders project page.
 * @param params is the project to display.
 */
const ProjectPage = async ({ params }: { params: { id: number; } }) => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  // console.log(projects);
  return (
    <Container id={PageIDs.projectPage} fluid className="py-3">
      <Link href="/project-list">Back to List of Projects</Link>
      <Row>
        <ProjectInfo
          key={`Project-${params}`}
          params={{
            id: params.id,
          }}
        />
      </Row>
    </Container>
  );
};

export default ProjectPage;
