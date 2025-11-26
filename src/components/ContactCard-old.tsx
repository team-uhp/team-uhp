import React from 'react';
import { User } from '@prisma/client';
import Link from 'next/link';
import { Badge, Card, CardBody, CardFooter, CardHeader, CardText, Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';

/* Renders a single row in the Contacts list. See contacts/page.tsx. */
/* In the form of the Project List cards. */
const ContactCardTest = ({ contact }: { contact: User }) => {
  const imgPath = `/${contact.image}`;
  return (
    <Container className="py-3">
      <Row className="justify-content-start">
        <Link
          href={`/user-profile/${contact.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Card>
            <CardHeader>
              <Row className="mx-auto g-0">
                <div style={{ width: '75px', height: '75px', position: 'relative' }}>
                  {contact.image && contact.image.trim() !== '/' ? (
                    <Image
                      src={imgPath}
                      alt={contact.username}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="75px"
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#888',
                    }}
                    >
                      No Image
                    </div>
                  )}
                </div>
                <Col id="contact-name" className="d-flex align-items-center">
                  <h1>&nbsp;{`${contact.firstName} ${contact.lastName}`}</h1>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <CardText id="contact-email">
                {contact.email}
              </CardText>
            </CardBody>
            <CardFooter className="flex gap-2 flex-wrap">
              {contact.skills.map((tag) => (
                <Badge
                  className="mx-1"
                  key={tag}
                  bg="info"
                >
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </Link>
      </Row>
    </Container>
  );
};

export default ContactCardTest;
