import ProjectInfo from '@/components/ProjectInfo';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';

/**
 * Renders project page.
 * @param params is the project to display.
 */
const ProjectPage = async ({ params }: { params: { id: string; } }) => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions) as {
    user: { email: string; id: string; randomKey: string };
  } | null;
  loggedInProtectedPage(session);

  const userId = Number(session?.user?.id);
  const project = await prisma.project.findUnique({ where: { id: Number(params.id) } });

  if (project && session?.user && project.admins.includes(userId)) {
  // console.log(projects);
    return (
      <Container id={PageIDs.projectPage} fluid className="py-3">
        <Link href="/project-list">Back to List of Projects</Link>
        <Row>
          <ProjectInfo
            key={`Project-${params}`}
            params={{
              id: Number(params.id),
            }}
          />
        </Row>
        <Link
          href={`/add-opening/${params.id}`}
          key={`Project-${params}`}
        >
          Recruit for Opening
        </Link>
      </Container>
    );
  }
  return (
    <Container id={PageIDs.projectPage} fluid className="py-3">
      <Link href="/project-list">Back to List of Projects</Link>
      <Row>
        <ProjectInfo
          key={`Project-${params}`}
          params={{
            id: Number(params.id),
          }}
        />
      </Row>
    </Container>
  );
};

export default ProjectPage;
