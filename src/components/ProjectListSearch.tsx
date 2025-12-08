"use client";

import React, { useState, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCard";
import { Project, Position } from "@prisma/client";

type ProjectWithPositions = Project & { positions: Position[] };

export default function ProjectListSearch({
  projects,
}: {
  projects: Array<{ project: ProjectWithPositions; matches: number }>;
}) {
  const [search, setSearch] = useState("");

  // Apply name search only
  const filtered = useMemo(() => {
    return projects.filter(({ project }) =>
      project.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <>
      {/* LEFT SIDE: Search only */}
      <Col lg={3}>
        <h5>Search</h5>

        <label htmlFor="search">Search by title</label>
        <input
          type="text"
          id="search"
          placeholder="Project name..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Col>

      {/* RIGHT SIDE: Project cards */}
      <Col lg={9}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>Projects List</h2>
        </div>

        <Row className="g-4">
          {filtered.map((item) => (
            <ProjectCard
              key={`Project-${item.project.id}`}
              project={item.project}
            />
          ))}

          {filtered.length === 0 && (
            <p className="text-muted mt-3">No projects match your search.</p>
          )}
        </Row>
      </Col>
    </>
  );
}
