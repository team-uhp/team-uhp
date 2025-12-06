'use client';

import React from 'react';
import { User } from '@prisma/client';
import { Button } from 'react-bootstrap';

const UserList = ({
  id,
  username,
  email,
  firstName,
  lastName,
  role, 
  image,
  changeRole
}: User & { changeRole: (userId: number) => void }) => {
  const handleChange = () => {
    changeRole(id);
  };

  return (
    <tr key={id}>
      <td>{id}</td>
      <td>{username}</td>
      <td>{email}</td>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{role}</td>
      <td>
        <Button 
          type="button" 
          variant="primary"
          onClick={handleChange}
        >
          Change
        </Button>
      </td>
      <td>{image}</td>
      <td><a href={`/edit-profile/${id}`}>Edit</a></td>
    </tr>
  );
};

export default UserList;