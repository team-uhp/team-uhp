'use client';

import { Skills } from '@prisma/client';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const TagsContainer = ({ tags, removeTag, addTag, forceUpdate }: {
  tags: any[],
  removeTag: (tag: any) => void,
  addTag: (tag: any) => void,
  forceUpdate: () => void
}) => {
  const [newTag, setNewTag] = useState<any>('');
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    setNewTag(selectedTag);
  };

  return (
    <>
      <Row>
        <Col>
          <Form.Select onChange={onChange}>
            <option key="default" value="">Select a skill to add</option>
            {
              Object.values(Skills).map((skill) => {
                if (!tags.includes(skill)) {
                  return <option key={skill} value={skill}>{skill}</option>;
                }
                return null;
              })
            }
          </Form.Select>
          <Button type="button" onClick={() => { addTag(newTag); }} variant="secondary" className="mt-2">
            Add
          </Button>
        </Col>
      </Row>
      <Container fluid className="tags-container" onClick={forceUpdate}>
        {tags.map((tag) => (
          <div key={tag} className="tag">
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>x</button>
          </div>
        ))}
      </Container>
    </>
  );
};

export default TagsContainer;
