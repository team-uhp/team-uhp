'use client';

import { Skills } from '@prisma/client';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const TagsContainer = <T extends React.Key>({ defaultValue, type, tags, removeTag, addTag, forceUpdate }: {
  defaultValue: string,
  type: string,
  tags: T[],
  removeTag: (tag: T) => void,
  addTag: (tag: T) => void,
  forceUpdate: () => void
}) => {
  const [newTag, setNewTag] = useState<T>('' as unknown as T);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    setNewTag(selectedTag as unknown as T);
  };

  return (
    <>
      <Row>
        <Col>
          <Form.Select onChange={onChange}>
            <option key="default" value="">{defaultValue}</option>
            {
              type === 'skills' && Object.values(Skills).map((item) => {
                if (!tags.includes(item as unknown as T)) {
                  return <option key={item} value={item}>{item}</option>;
                }
                return null;
              })
            }
            {
              type === 'availability' && Array.from({ length: 14 }, (_, i) => i + 1).map((item) => {
                if (!tags.includes(item as unknown as T)) {
                  return <option key={item} value={item}>{`Slot ${item}`}</option>;
                }
                return null;
              })
            }
            {
              type === 'contacts' && Array.from({ length: 5 }, (_, i) => i + 1).map((item) => {
                if (!tags.includes(item as unknown as T)) {
                  return <option key={item} value={item}>{`Contact ${item}`}</option>;
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
