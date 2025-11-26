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
  const user: User | null = await prisma.user.findUnique({
    where: { id: Number(sessionUser!.user.id) },
  });
  const contacts: User[] = await prisma.user.findMany({ where: { 
    id: { in: user?.contacts || [] }
  } });

  return (
    <Container id={PageIDs.contactsPage} className="py-4 pt-5">
      <Row>
        <h1 className="py-3">Your Contacts</h1>
        {contacts.map((contact) => (
        <ContactCard contact={contact} key={`${contact.id}`} />
      ))}
      </Row>
    </Container>
  );
};

export default ContactPage;
