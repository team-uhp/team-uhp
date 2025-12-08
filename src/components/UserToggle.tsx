import { Button, Col, Row } from 'react-bootstrap';

/* Renders a single member in a project. See project-page/page.tsx. */

type UserToggleProps = {
  name: string;
  isChecked: boolean;
  onChange: () => void;
};

const UserToggle: React.FC<UserToggleProps> = ({ name, isChecked, onChange }) => {

  return (
    <div id="user-toggle">
      <Button variant="primary" className="member-button">
        <Row>
          <Col>
            <input
              type="checkbox"
              id={`checkbox-${name}`}
              checked={isChecked}
              onChange={onChange}
            />
          </Col>
          <Col style={{ whiteSpace: 'nowrap' }}>
            {name}
          </Col>
        </Row>
      </Button>
    </div>
  );
};

export default UserToggle;
