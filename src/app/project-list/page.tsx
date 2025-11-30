import React from 'react';
import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import ProjectCard from '@/components/ProjectCard';
import { PageIDs } from '@/utilities/ids';
import Link from 'next/link';
import { Project, Position, Skills } from '@prisma/client';

/** Render a list of projects for the logged in user. */
const ProjectListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string, skills: Skills[] };
    } | null,
  );
  type ProjectWithPositions = Project & { positions: Position[] };

  const projects = await prisma.project.findMany({
    include: { positions: true },
  }) as ProjectWithPositions[];
  
  const sessionUser = session?.user as { id: string };
  const user = await prisma.user.findUnique({
    where: { id: Number(sessionUser.id) },
    select: { skills: true },
  });
  const userSkills: Skills[] = user?.skills || [];

  const sortedProjs: Array<{ project: Project; matches: number }> = [];

  projects.forEach((project) => sortedProjs.push(
    { project,
      matches: project.skills.filter(skill => userSkills.includes(skill)).length,
    },
  ));

  sortedProjs.sort((a, b) => b.matches - a.matches);

  return (
    <Container id={PageIDs.projectsList} className="py-3">
      <Row>
        <Col>
          <Row>
            {/* Left section: search and filter*/}
            <Col lg={3}>
              <h5>Filters & Search</h5>
              <div>
                <label htmlFor="search">Search by title</label>
                <input type="text" id="search" placeholder="Project name..." className="form-control mb-3" />
                
                <label htmlFor="category">Category</label>
                <select id="category" className="form-select mb-3">
                  <option value="">All</option>
                  {/*TO DO: Add more filter (project type, skills/field/area of study) */}
                </select>

                {/*TO DO: Add funtionality for search (dictionary, etc.) */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  id="search-button"
                >
                  Search
                </button>
              </div>
            </Col>

            {/* Right section: project cards */}
            <Col lg={9}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Projects List</h2>
                <Link
                  href="/project-page/add-project/"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#008091',
                    borderColor: 'transparent',
                    fontSize: '16px',
                  }}
                >
                  Add Project
                </Link>
              </div>

              <Row className="g-4">
                {sortedProjs.map((item) => (
                  <ProjectCard key={`Project-${item.project.id}`} project={item.project} />
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectListPage;
