'use client';

import React from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Segments that represent *folders without pages* → never clickable
const NON_CLICKABLE_SEGMENTS = [
  'add-opening',
  'add-project',
  'apply-opening',
  'application',
  'edit-application',
  'edit-opening',
  'edit-project',
  'forgotpassword',
  'not-authorized',
  'passchange',
  'project-opening',
  'signup',
  'user-profile',
  'verify',
  'auth',
];

// Optional overrides for specific paths
const PATH_OVERRIDES: Record<string, { label: string; href?: string; clickable?: boolean }> = {
  '/edit-profile': { label: 'Edit Profile', clickable: false },
  '/auth/change-password': { label: 'Change Password', clickable: false },
  '/auth/signin': { label: 'Sign In', clickable: false },
  '/auth/signout': { label: 'Sign Out', clickable: false },
  '/auth/forgot-password': { label: 'Forgot Password', clickable: false },
  '/auth/forgot-username': { label: 'Forgot Username', clickable: false },
  '/project-page': { label: 'Projects List', href: '/project-list', clickable: true},
};

// Static folder names for nicer labels
const STATIC_SEGMENTS: Record<string, string> = {
  'project-page': 'Projects',
  'project-opening': 'Project Opening',
  'add-project': 'Add Project',
  'edit-project': 'Edit Project',
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
    const isNonClickable = NON_CLICKABLE_SEGMENTS.includes(segment);

    // Overrides first
    if (PATH_OVERRIDES[fullPath]) {
      const { label, href, clickable } = PATH_OVERRIDES[fullPath];
      const isClickable = !isLast && !isNonClickable && clickable !== false && href;

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

    // Numeric segments → show as ID
    if (isNumeric(segment)) {
      crumbs.push(
        <Breadcrumb.Item active key={fullPath}>
          ID: {segment}
        </Breadcrumb.Item>
      );
      return;
    }

    // Non-clickable segment
    if (isNonClickable) {
      const label = STATIC_SEGMENTS[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      crumbs.push(
        <Breadcrumb.Item key={fullPath} active>
          {label}
        </Breadcrumb.Item>
      );
      return;
    }

    // Default segment
    const label = STATIC_SEGMENTS[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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
