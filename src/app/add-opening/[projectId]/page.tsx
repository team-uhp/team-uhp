import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import AddOpeningForm from '@/components/AddOpeningForm';

const AddOpening = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  const projectIdNum = Number(projectId);
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  return (
    <main>
      <AddOpeningForm projectId={projectIdNum} />
    </main>
  );
};

export default AddOpening;
