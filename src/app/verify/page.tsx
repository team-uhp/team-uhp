import { prisma } from '@/lib/prisma';
import { Container } from 'react-bootstrap';

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams;

  const user = await prisma.user.findFirst({
    where: { validcheck: token },
  });

  console.log('Received: ', token);

  if (!token || !user) {
    return (
      <Container>
        <h1>Invalid verification link</h1>
        <p>
          The verification link is invalid or expired, or you have previously
          been verified. Contact us via the email below for assistance, or&nbsp;
        </p>
        <a href="/auth/signup">signup for an account</a>
      </Container>
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      validation: true,
      validcheck: null,
    },
  });

  return (
    <Container>
      <h1>Email verified successfully!</h1>
      <p>Your account has been verified. You can now sign in.</p>
      <a href="/auth/signin">
        Click here to sign in
      </a>
    </Container>
  );
}
