'use client';

import React from "react";
import swal from 'sweetalert';
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Button } from "react-bootstrap";
import { applyDelete } from "@/lib/dbActions";

type ApplicationAdminProps = {
  user: User;
  applic: {
    id: number;
    projId: number;
    application: string;
    position?: {
      id?: number | null;
    } | null;
  };
};

const ApplicationAdmin: React.FC<ApplicationAdminProps> = ({ applic, user }) => {
  const router = useRouter();

  return (
    <Container fluid className="py-3">
      <Row>
        <h2>Applicant:</h2>
        <p>{user.firstName} {user.lastName}</p>
      </Row>
      <Row>
        <h2>Application Text:</h2>
        <p>{applic.application}</p>
      </Row>
      <Row>
        <Col>
            <Button variant="primary" href={`/project-opening/edit-application/${applic.id}`}>Edit Application</Button>
        </Col>
        <Col>
          <Button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();
              const willDelete = await swal({
                title: 'Are you sure you want to delete?',
                text: 'This action cannot be undone.',
                icon: 'warning',
                buttons: ['Cancel', 'Delete'],
                dangerMode: true,
              });

              if (willDelete) {
                try {
                  await applyDelete({ applicId: applic.id });
                  swal('Success!', 'Position deleted.', 'success', {
                    timer: 2000,
                  });
                  router.push(`/project-page/${applic.projId}`);
                }
                catch (err) {
                  console.error(err);
                  swal('Cancelled', 'Position was not deleted', 'info', {
                    timer: 2000,
                  });
                  router.push(`/project-opening/application/${applic.id}`)
                }
            }}}
            className="float-right"
          >
            DELETE
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ApplicationAdmin;
