'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Card
        style={{
          width: '420px',
          border: '2px solid #024731',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          borderRadius: '1rem',
        }}
      >
        <Card.Body>
          <h1
            style={{
              color: '#024731',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
            }}
          >
            Sign Out
          </h1>

          <p
            style={{
              textAlign: 'center',
              color: '#024731',
              fontSize: '1.05rem',
              marginBottom: '2rem',
            }}
          >
            Are you sure you want to sign out of your UH Mānoa account?
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                backgroundColor: '#024731',
                borderColor: '#024731',
                width: '100%',
                fontWeight: 'bold',
                color: 'white',
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#035a40')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#024731')}
            >
              Yes, Sign Out
            </Button>

            <Button
              variant="outline-success"
              type="button"
              onClick={() => router.push('/')}
              style={{
                borderColor: '#024731',
                color: '#024731',
                width: '100%',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#e6f3ec')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = 'white')}
            >
              Cancel
            </Button>
          </div>

        </Card.Body>
      </Card>
    </div>
  );
}
