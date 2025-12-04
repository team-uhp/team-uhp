import { Button, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

/* Renders a single member in a project. See project-page/page.tsx. */

type UserToggleProps = {
  name: string;
  isCheckInit?: boolean;
};

const UserToggle: React.FC<UserToggleProps> = ({ name, isCheckInit }) => {

  const [isChecked, setIsChecked] = useState<boolean>(isCheckInit ?? true);

  return (
    <Button variant="primary" className="member-button">
      <Row>
        <Col>
          <input
            type="checkbox"
            id="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(prev => !prev)}
          />
        </Col>
        <Col style={{ whiteSpace: 'nowrap' }}>
          {name}
        </Col>
      </Row>
    </Button>
  );
};

export default UserToggle;
