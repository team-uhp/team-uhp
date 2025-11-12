'use client';

import { useState } from 'react';
import { Container } from 'react-bootstrap';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(() => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

const TagsContainer = ({ tags, removeTag }: {
  tags: any[],
  removeTag: (tag: any) => void, }) => {
  const forceUpdate = useForceUpdate();
  return (
    <Container fluid className="tags-container" onClick={forceUpdate}>
      {tags.map((tag) => (
        <div key={tag} className="tag">
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>x</button>
        </div>
      ))}
    </Container>
  );
};

export default TagsContainer;
