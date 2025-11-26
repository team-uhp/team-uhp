'use client';

import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const BreadcrumbBar = () => {
  const pathname = usePathname(); // e.g. "/project-list/123"
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = index === segments.length - 1;

    return isLast ? (
      <Breadcrumb.Item active key={href}>
        {label}
      </Breadcrumb.Item>
    ) : (
      <Breadcrumb.Item key={href} linkAs={Link} href={href}>
        {label}
      </Breadcrumb.Item>
    );
  });

  return (
    <Container fluid id="breadcrumb-bar">
      <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/">
              Home
            </Breadcrumb.Item>
            {crumbs}
          </Breadcrumb>
      </Container>
    </Container>
  );
};

export default BreadcrumbBar;
