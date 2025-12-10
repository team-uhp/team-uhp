'use client';

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
import { toggleBookmark } from "@/lib/bookmarkActions";

interface BookmarkButtonProps {
  userId: number;
  projectId: number;
  isInitiallyBookmarked?: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  userId,
  projectId,
  isInitiallyBookmarked = false,
}) => {
  const [bookmarked, setBookmarked] = useState(isInitiallyBookmarked);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const newState = await toggleBookmark(userId, projectId);
      setBookmarked(newState);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="outline-primary"
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
