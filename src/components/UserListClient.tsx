'use client';

import React from 'react';
import { User } from '@prisma/client';
import { Table } from 'react-bootstrap';
import UserList from '@/components/UserList';
import { changeUserRole } from '@/lib/dbActions';

export default function UserListClient({ users }: { users: User[] }) {
  const handleRoleChange = async (userId: number) => {
    try {
      await changeUserRole(userId);
    } catch (error) {
      console.error('Failed to change role', error);
    }
  }

  return (
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
            changeRole={handleRoleChange}
          />
        ))}
      </tbody>
    </Table>
  );
}