import React from 'react';
import { prisma } from '@/lib/prisma';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

/** Renders a single opening in a project. See project-page/page.tsx. */

const OpeningTitle = async ({ openingid }: { openingid: number }) => {
  const opening = await prisma.position.findUnique({ where: { id: openingid } });
  if (!opening) {
    return (
      'Error'
    );
  }

  return (
    <Link
      href={`/project-opening/${opening.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Button className="opening-title-button">
        {opening.title}
      </Button>
    </Link>
  );
};

export default OpeningTitle;
