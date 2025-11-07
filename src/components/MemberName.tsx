import { prisma } from '@/lib/prisma';
import { Button } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import Link from 'next/link';

/* Renders a single member in a project. See project-page/page.tsx. */

const MemberName = async ({ userid }: { userid: number }) => {
  const member = await prisma.user.findUnique({ where: { id: userid } });
  if (!member) {
    notFound();
  }

  return (
    <Link
      href={`/user-profile/${member.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Button>
        {member.firstName}
        &nbsp;
        {member.lastName}
      </Button>
    </Link>
  );
};

export default MemberName;
