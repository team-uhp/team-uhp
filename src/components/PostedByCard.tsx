import React from "react";
import { Card, CardBody, CardHeader, Image } from "react-bootstrap";

interface PostedByProps {
  admin: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
    projects?: { id: number }[];
  } | null;
}

const PostedByCard: React.FC<PostedByProps> = ({ admin }) => {
  return (
    <Card id="posted-by-card" className="mb-3">
      <CardHeader>Posted By</CardHeader>
      <CardBody>
        {admin ? (
          <>
            <div className="posted-by-info">
              <Image
                src={`${admin.image || "default-profile.png"}`}
                alt="Profile"
                width={40}
                height={40}
              />
              <div className="posted-by-text">
                <strong>
                  {admin.firstName} {admin.lastName}
                </strong>
                <div>{admin.email}</div>
              </div>
            </div>
            <hr />
            <div className="projects-worked">
              Projects Worked: {admin.projects?.length || 0}
            </div>
            <hr />
            <a href={`/user-profile/${admin.id}`}>View Profile</a>
          </>
        ) : (
          <div>No admin found.</div>
        )}
      </CardBody>
    </Card>
  );
};

export default PostedByCard;
