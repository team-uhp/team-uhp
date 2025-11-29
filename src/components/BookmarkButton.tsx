'use client';

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
const BookmarkButton: React.FC = () => {
  const [bookmarked, setBookmarked] = useState(false);
  // TODO: Implement Bookmark Functionality & Logic (hook up to backend

  return (
    <Button
    variant="outline-primary"
    onClick={() => setBookmarked(!bookmarked)}
    className="d-flex align-items-center gap-2"
    style={{ 
      width: '100%',
      justifyContent: 'center',
      color: bookmarked ? '#ffffff' : '#111613',
      backgroundColor: bookmarked ? '#024731' : 'transparent',
      borderColor: '#111613',
      borderRadius: '0.2rem',
      marginTop: '25px',
      fontSize: '0.9rem',
    }}
    >
      {bookmarked ? <BookmarkFill /> : <Bookmark />}
      {bookmarked ? "Saved" : "Save Project"}
    </Button>
  );
};

export default BookmarkButton;
