import React from 'react';
import { User } from '@prisma/client';
import Link from 'next/link';
import { Col } from 'react-bootstrap';

/* Renders a single card in the Contacts list. See contacts/page.tsx. */
const ContactCard = ({ contact }: { contact: User }) => {
  return (
      <Col md={4} lg={3} sm={6} xs={12} className="mb-4">
          <div className="contact-card">
            <Link
              href={`/user-profile/${contact.id}`}
            >
              <img src={`${contact.image}`} alt={contact.username} width={75} height={75} />
              <h3>{contact.firstName} {contact.lastName}</h3>
              <p>{contact.username}</p>
            </Link>
          </div>
      </Col>
  );
};

export default ContactCard;
