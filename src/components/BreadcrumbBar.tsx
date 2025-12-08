'use client';

import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PATH_OVERRIDES: Record<string, { label: string; href?: string }> = {
  '/user-profile': { label: 'User Profile' },
  '/project-page': { label: 'Project List', href: '/project-list' },
  '/project-opening': { label: 'Project Opening', href: '/project-opening' },
  '/auth/change-password': { label: 'Change Password' },
  '/auth/signin': { label: 'Sign In' },
  '/auth/signup': { label: 'Sign Up' },
  '/auth/signout': { label: 'Sign Out' },
  '/auth/forgot-password': { label: 'Forgot Password' },
  '/auth/forgot-username': { label: 'Forgot Username' },
};

// Optional static folder names for aesthetics
const STATIC_SEGMENTS: Record<string, string> = {
  'project-page': 'Projects',
};

const isNumeric = (str: string) => /^\d+$/.test(str);

const BreadcrumbBar: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const lastIndex = segments.length - 1;

  const crumbs: React.ReactNode[] = [];

  segments.forEach((segment, index) => {
    const fullPath = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === lastIndex;

    // Apply overrides
    if (PATH_OVERRIDES[fullPath]) {
      const { label, href } = PATH_OVERRIDES[fullPath];
      crumbs.push(
        <Breadcrumb.Item
          key={fullPath}
          {...(isLast || !href ? { active: true } : { linkAs: Link, href })}
        >
          {label}
        </Breadcrumb.Item>
      );
      return;
    }

    // Numeric segments: show as ID
    if (isNumeric(segment)) {
      crumbs.push(
        <Breadcrumb.Item active key={fullPath}>
          ID: {segment}
        </Breadcrumb.Item>
      );
      return;
    }

    // Static folder label (if defined)
    const staticLabel = STATIC_SEGMENTS[segment];
    const label = staticLabel || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    crumbs.push(
      <Breadcrumb.Item
        key={fullPath}
        {...(isLast ? { active: true } : { linkAs: Link, href: fullPath })}
      >
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
