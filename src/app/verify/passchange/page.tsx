import React from 'react';
import { prisma } from '@/lib/prisma';
import { Container } from 'react-bootstrap';

export default async function PassChangeCanx({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams;

  const user = await prisma.user.findFirst({
    where: { passchgcanx: token },
  });

  console.log('Received: ', token);

  if (!token || !user) {
    return (
      <Container>
        <h1>Invalid verification link</h1>
        <p>
          The verification link is invalid, expired, or you have previously
          locked your account.
        </p>
        <br />
        <p>
          <a href='@/auth/forgot-password'>Click here to reset your password</a>, or contact us at the email below for assistance.
        </p>
      </Container>
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      validation: false,
      validpasschg: null,
    },
  });

  return (
    <Container>
      <h1>Account locked successfully!</h1>
      <p>Your account has been locked.</p>
      <a href="/auth/forgot-password">
        Click here to reset your password.
      </a>
    </Container>
  );
}
