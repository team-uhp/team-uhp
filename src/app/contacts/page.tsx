import React from 'react';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import { getServerSession } from 'next-auth';
import { Container, Row } from 'react-bootstrap';
import { User } from '@prisma/client';
import ContactCard from '@/components/ContactCard';

/**
 * Renders User's contact page.
 * @param params is the contact to display.
 */
const ContactPage = async () => {

  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  const sessionUser = session as { user: { email: string; id: string; randomKey: string } } | null;
  loggedInProtectedPage(sessionUser);
  
  // Get the contact data from database using the id from params
  const userId = sessionUser!.user.id;
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    include: { contacts: true },
  });
  
  const contacts: User[] = user?.contacts || [];

  return (
    <Container id={PageIDs.contactsPage} className="py-4 pt-5">
    <Row className="d-flex justify-content-between align-items-center">
      <h1 className="py-3">Your Contacts</h1>
      <div className="py-3 text-muted">
        Contacts: {contacts.length}
      </div>
    </Row>

    <Row>
      {contacts.length === 0 ? (
        <p>You currently have no contacts to list.</p>
      ) : (
        contacts.map((contact) => (
          <ContactCard contact={contact} key={contact.id} />
        ))
      )}
    </Row>
  </Container>
  );
};

export default ContactPage;
