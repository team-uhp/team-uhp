import { getServerSession } from 'next-auth';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Container, Row, Col } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import UserListClient from '@/components/UserListClient';

const UsersAdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container fluid id="list" className="py-3">
        <Row className="justify-content-center">
          <Col lg={11}>
            <h1>List Users Admin</h1>
            <UserListClient users={users} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UsersAdminPage;
