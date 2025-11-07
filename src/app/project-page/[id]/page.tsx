import authOptions from "@/lib/authOptions";
import { loggedInProtectedPage } from "@/lib/page-protection";
import { prisma } from "@/lib/prisma";
import { PageIDs } from "@/utilities/ids";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Container, Row } from "react-bootstrap";


/**
 * Renders project page.
 * @param proj of the project to display.
 */
const ProjectPage = async ({ params }: { params: { id: string; } }) => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );

  const projectId = parseInt(params.id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    notFound();
  }
  // console.log(projects);
  return (
    <Container id={PageIDs.projectPage} fluid className="py-3">
      <Row>
        <h1>{project.title}</h1>
      </Row>
    </Container>
  );
};

export default ProjectPage;
