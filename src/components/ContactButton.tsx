'use client';

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { PersonPlus, PersonDash } from 'react-bootstrap-icons'; // icons for add/remove contact
import { toggleContact } from '@/lib/contactsActions';

interface ContactButtonProps {
  isInitiallyContact: boolean;
  currentUserId: number;
  profileId: number;
}

const ContactButton: React.FC<ContactButtonProps> = ({ isInitiallyContact, currentUserId, profileId }) => {
  const [isContact, setIsContact] = useState(isInitiallyContact);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const newState = await toggleContact(currentUserId, profileId);
    setIsContact(newState);
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="d-flex align-items-center gap-2"
      style={{
        width: '100%',
        justifyContent: 'center',
        fontSize: '0.9rem',
        marginTop: '25px',
        borderRadius: '0.2rem',
        color: isContact ? '#ffffff' : '#111613',
        backgroundColor: isContact ? '#024731' : 'transparent',
        borderColor: '#111613',
      }}
    >
      {isContact ? <PersonDash /> : <PersonPlus />}
      {isContact ? 'Remove Contact' : 'Add Contact'}
    </Button>
  );
};

export default ContactButton;
