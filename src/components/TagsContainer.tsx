'use client';

import React from 'react';
import { Skills } from '@prisma/client';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

type CommonProps = {
  defaultValue: string;
  forceUpdate: () => void;
};

type SkillsProps = CommonProps & {
  type: 'skills';
  tags: Skills[];
  addTag: (tag: Skills) => void;
  removeTag: (tag: Skills) => void;
};

type NumberProps = CommonProps & {
  type: 'availability' | 'contacts';
  tags: number[];
  addTag: (tag: number) => void;
  removeTag: (tag: number) => void;
};

type TagsContainerProps = SkillsProps | NumberProps;

const TagsContainer = ({ defaultValue, type, tags, removeTag, addTag, forceUpdate }: TagsContainerProps) => {
  // State to store the new tag to be added
  const [newTag, setNewTag] = useState<Skills | number | undefined>();

  // Handler for dropdown selection changes; updates the newTag state
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!value) {
      setNewTag(undefined);
      return;
    }
    if (type === 'skills') {
      // value comes as string, validate against Skills enum
      const v = value as Skills;
      if (Object.values(Skills).includes(v)) {
        setNewTag(v);
      }
    } else {
      // availability/contacts -> numbers
      const n = Number(value);
      if (!Number.isNaN(n)) {
        setNewTag(n);
      }
    }
  };

  const onAdd = () => {
    if (newTag === undefined) return;
    if (type === 'skills') {
      addTag(newTag as Skills);
    } else {
      addTag(newTag as number);
    }
    setNewTag(undefined);
  };

  return (
    <>
      <Row>
        <Col md={10}>
          <Form.Select onChange={onChange} onClick={forceUpdate}>
            <option key="default" value="">{defaultValue}</option>
            {
              type === 'skills' && Object.values(Skills).map((item) => {
                if (!(tags as Skills[]).includes(item)) {
                  return <option key={item} value={item}>{item}</option>;
                }
                return null;
              })
            }
            {
              type === 'availability' && Array.from({ length: 14 }, (_, i) => i + 1).map((item) => {
                if (!(tags as number[]).includes(item)) {
                  return <option key={item} value={item}>{`Slot ${item}`}</option>;
                }
                return null;
              })
            }
            {
              type === 'contacts' && Array.from({ length: 5 }, (_, i) => i + 1).map((item) => {
                if (!(tags as number[]).includes(item)) {
                  return <option key={item} value={item}>{`Contact ${item}`}</option>;
                }
                return null;
              })
            }
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex align-items-center justify-content-center">
          <Button type="button" onClick={onAdd} variant="secondary">
            Add
          </Button>
        </Col>
      </Row>
      <Container fluid className="tags-container">
        {type === 'skills'
          ? (tags as Skills[]).map((tag) => (
            <div key={tag} className="tag">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>x</button>
            </div>
          ))
          : (tags as number[]).map((tag) => (
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
