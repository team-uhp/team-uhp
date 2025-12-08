"use client";

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { Project, Position, Skills } from "@prisma/client";

type ProjectWithPositions = Project & { positions: Position[] };

export default function ProjectListClient({
  projects,
}: {
  projects: Array<{ project: ProjectWithPositions; matches: number }>;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [skillTerm, setSkillTerm] = useState("");

  // Filtering logic
  const filtered = projects.filter(({ project }) => {
    const matchesName = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSkill =
      skillTerm === "" || project.skills.includes(skillTerm as Skills);

    return matchesName && matchesSkill;
  });

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setSkillTerm(skillInput);
  };

  // Convert enum keys to dropdown options
  const allSkills = Object.values(Skills);

  return (
    <Row>
      {/* LEFT: Search Panel */}
      <Col lg={3}>
        <h5>Filters & Search</h5>

        {/* TEXT SEARCH */}
        <label htmlFor="search">Search by title</label>
        <input
          type="text"
          id="search"
          className="form-control mb-3"
          placeholder="Project name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {/* SKILL DROPDOWN */}
        <label htmlFor="skills">Skill</label>
        <select
          id="skills"
          className="form-select mb-3"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
        >
          <option value="">All Skills</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        {/* SEARCH BUTTON */}
        <button type="button" className="btn btn-secondary" onClick={handleSearch}>
          Search
        </button>
      </Col>

      {/* RIGHT: Project Cards */}
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

          <Link
            href="/project-page/add-project/"
            className="btn btn-primary"
            style={{
              backgroundColor: "#008091",
              borderColor: "transparent",
              fontSize: "16px",
            }}
          >
            Add Project
          </Link>
        </div>

        <Row className="g-4">
          {filtered.map((item) => (
            <ProjectCard key={item.project.id} project={item.project} />
          ))}
        </Row>
      </Col>
    </Row>
  );
}
