'use client';

import React from "react";
import swal from 'sweetalert';
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Button } from "react-bootstrap";
import { applyAccept, applyDelete } from "@/lib/dbActions";

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
    <Container fluid className="py-3" style={{ marginBottom: '35px' }}>
      <Row>
        <h2>Applicant:</h2>
        <p>{user.firstName} {user.lastName}</p>
      </Row>
      <Row>
        <h2>Application Text:</h2>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#333' }}>
          {applic.application}
        </div>
      </Row>
      <Row>
        <Col>
            <Button
            type="button"
            style={{ marginTop: '30px', backgroundColor: '#0E4F6C', borderColor: 'transparent' }}
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();
              const willAccept = await swal({
                title: 'Are you sure you want to accept?',
                buttons: ['Cancel', 'Accept'],
                dangerMode: true,
              });

              if (willAccept) {
                try {
                  await applyAccept({ applicId: applic.id });
                  swal('Success!', 'Application accepted.', 'success', {
                    timer: 2000,
                  });
                  router.push(`/project-page/${applic.projId}`);
                }
                catch (err) {
                  console.error(err);
                  swal('Cancelled', 'Application was not accepted', 'info', {
                    timer: 2000,
                  });
                  router.push(`/project-opening/application/${applic.id}`)
                }
            }}}
            className="float-right"
          >
            Accept
          </Button>
        </Col>
        <Col>
          <Button
            type="button"
            style={{ marginTop: '30px' }}
            variant="danger"
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
                  swal('Success!', 'Application deleted.', 'success', {
                    timer: 2000,
                  });
                  router.push(`/project-page/${applic.projId}`);
                }
                catch (err) {
                  console.error(err);
                  swal('Cancelled', 'Application was not deleted', 'info', {
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
