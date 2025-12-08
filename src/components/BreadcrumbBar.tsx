'use client';

import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PATH_OVERRIDES: Record<string, { label: string; href?: string; clickable?: boolean }> = {
  '/user-profile': { label: 'User Profile' },
  '/edit-profile': { label: 'Edit Profile', clickable: false },
  '/project-page': { label: 'Project List', href: '/project-list' },
  '/project-opening': { label: 'Project Opening', href: '/project-opening' },
  '/auth/change-password': { label: 'Change Password' },
  '/auth/signin': { label: 'Sign In' },
  '/auth/signup': { label: 'Sign Up' },
  '/auth/signout': { label: 'Sign Out' },
  '/auth/forgot-password': { label: 'Forgot Password' },
  '/auth/forgot-username': { label: 'Forgot Username' },
};

// Segments that represent *folders without pages* → never clickable
const NON_CLICKABLE_SEGMENTS = [
  'edit-project',
  'edit-profile',
  'project-page',
  'project-opening',
  'add-opening',
];

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

    if (PATH_OVERRIDES[fullPath]) {
      const { label, href, clickable } = PATH_OVERRIDES[fullPath];
      const isClickable = !isLast && clickable !== false && href;

      crumbs.push(
        <Breadcrumb.Item
          key={fullPath}
          {...(isClickable ? { linkAs: Link, href } : { active: true })}
        >
          {label}
        </Breadcrumb.Item>
      );
      return;
    }

    if (isNumeric(segment)) {
      crumbs.push(
        <Breadcrumb.Item active key={fullPath}>
          ID: {segment}
        </Breadcrumb.Item>
      );
      return;
    }

    if (NON_CLICKABLE_SEGMENTS.includes(segment)) {
      const label = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      crumbs.push(
        <Breadcrumb.Item key={fullPath} active>
          {label}
        </Breadcrumb.Item>
      );
      return;
    }

    const staticLabel = STATIC_SEGMENTS[segment];
    const label = staticLabel || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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
