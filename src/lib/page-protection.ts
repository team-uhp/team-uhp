import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null) => {
  if (!session) {
    redirect('/auth/signin');
  }
};

/**
 * Redirects to the not-authorized page if user is not authorized user or site admin.
 */
export const userProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null, allowList: string[] ) => {
  loggedInProtectedPage(session);
  if (session && session.user.randomKey !== Role.ADMIN) {
    if (!allowList.includes(session.user.id)) {
      redirect('/not-authorized');
    }
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: { user: { email: string; id: string; randomKey: string } } | null) => {
  loggedInProtectedPage(session);
  if (session && session.user.randomKey !== Role.ADMIN) {
    redirect('/not-authorized');
  }
};
