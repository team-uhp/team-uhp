import React from 'react';
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
    <div id="membername-wrapper">
      <Link
        href={`/user-profile/${member.id}`}
        style={{ textDecoration: 'none' }}
      >
        <Button className="member-button">
          <img
            src={member.image || "/default-profile.jpg"}
            alt={`${member.firstName} ${member.lastName}`}
            width={32}
            height={32}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "5px",
            }}
          />
          {member.firstName}
          &nbsp;
          {member.lastName}
        </Button>
      </Link>
    </div>
  );
};

export default MemberName;
