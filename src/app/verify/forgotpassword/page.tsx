import React from 'react';
import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export default async function ForgotPass({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams;
  const user = await prisma.user.findFirst({
    where: { validpasschg: token },
  });

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
  console.log(user.password);

  return <ForgotPasswordForm email={String(user.email)} />;
}
