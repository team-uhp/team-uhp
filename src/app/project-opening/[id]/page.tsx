import NotFound from '@/app/not-found';
import OpeningInfo from '@/components/OpeningInfo';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { Container, Row } from 'react-bootstrap';

/**
 * Renders project opening page.
 * @param params is the project to pull openings to display.
 */
const ProjectOpening = async ({ params }: { params: {
  id: number;
} }) => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const position = await prisma.position.findUnique({ where: { id: Number(params.id) } });
  if (!position) {
    return NotFound();
  }
  // console.log(project opening);
  return (
    <Container id={PageIDs.openingPage} fluid className="py-3">
      <Link href={`/project-page/${position.project}`}>Back to Project</Link>
      <Row>
        <OpeningInfo
          key={`Position-${params}`}
          params={{
            id: params.id,
          }}
        />
      </Row>
    </Container>
  );
};

export default ProjectOpening;
