import React from 'react';
import { Project } from '@prisma/client';

const ProjectList = ({ id, title, descrip, duedate, image }: Project) => (
  <tr key={id}>
    <td>{id}</td>
    <td>{title}</td>
    <td>{descrip}</td>
    <td>{duedate}</td>
    <td>{image}</td>
    <td><a href={`/edit-project/${id}`}>Edit</a></td>
  </tr>
);

export default ProjectList;
