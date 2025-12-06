import React from 'react';
import { getServerSession } from 'next-auth';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import UserList from '@/components/UserList';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

const UsersAdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const users = await prisma.user.findMany({});

  const handleUserChange = async (userId: number) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('Could not find user');

      const newRole: Role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
    } catch (error) {
      console.error('Failed to change user role', error);
      throw error;
    }
  };

  return (
    <main>
      <Container id="list" className="py-3">
        <Row>
          <Col>
            <h1>List Users Admin</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id #</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Image</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserList
                    key={user.id}
                    {...user}
                    changeRole={handleUserChange}
                  />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UsersAdminPage;
