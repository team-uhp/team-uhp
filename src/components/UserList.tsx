import { User } from '@prisma/client';

const UserList = ({ id, username, email, firstName, lastName, role, image }: User) => (
  <tr key={id}>
    <td>{id}</td>
    <td>{username}</td>
    <td>{email}</td>
    <td>{firstName}</td>
    <td>{lastName}</td>
    <td>{role}</td>
    <td>{image}</td>
    <td><a href={`/user-profile/${id}`}>Edit</a></td>
  </tr>
);

export default UserList;
