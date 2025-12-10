'use client';

import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { Project, Position, Skills } from "@prisma/client";
import { groupedSkills } from "@/utilities/skills";
import { splitCamelCase } from "@/utilities/format";

type ProjectWithPositions = Project & { positions: Position[] };

export default function ProjectListClient({
  projects,
  savedProjectIds = [],
}: {
  projects: Array<{ project: ProjectWithPositions; matches: number }>;
  savedProjectIds?: number[];
}) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedField, setSelectedField] = useState(""); // single field dropdown
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});

  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const handleSearch = () => setSearchTerm(searchInput);

  // Reset all filters
  const handleReset = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedField("");
    setSelectedSkills({});
    setShowSavedOnly(false);
  };

  // Skills to show in dropdown, filtered by selectedField
  const skillsToShow = selectedField ? groupedSkills[selectedField] || [] : [];

  // Array of selected skills for badges
  const selectedSkillsArray = Object.entries(selectedSkills)
    .filter(([, isSelected]) => isSelected)
    .map(([skill]) => skill);

  // Filtering logic: match any of selected skills
  const filtered = projects.filter(({ project }) => {
    const matchesName = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill =
      selectedSkillsArray.length === 0 ||
      selectedSkillsArray.some((skill) => project.skills.includes(skill as Skills));
    const matchesSaved = !showSavedOnly || savedProjectIds.includes(project.id);
    return matchesName && matchesSkill && matchesSaved;
  });

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) => ({ ...prev, [skill]: !prev[skill] }));

  const removeSkill = (skill: string) =>
    setSelectedSkills((prev) => ({ ...prev, [skill]: false }));

  // Get date today for comparison
  const now = new Date();
  console.log(now.toISOString());

  return (
    <Row style={{ marginBottom: "75px" }} id="search-panel">
      {/* LEFT: Search Panel */}
      <Col lg={3}>
        <h5>Filters & Search</h5>

        {/* TEXT SEARCH */}
        <Form.Label htmlFor="search">Search by title</Form.Label>
        <Form.Control
          type="text"
          id="search"
          placeholder="Project name..."
          className="mb-3"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {/* FIELD DROPDOWN */}
        <Form.Label htmlFor="fields">Select Field</Form.Label>
        <Form.Select
          id="fields"
          className="mb-3"
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
        >
          <option value="">-- Select a field --</option>
          {Object.keys(groupedSkills).map((field) => (
            <option key={field} value={field}>
              {splitCamelCase(field)}
            </option>
          ))}
        </Form.Select>

        {/* SKILLS DROPDOWN */}
        {skillsToShow.length > 0 && (
          <>
            <Form.Label htmlFor="skills">Select Skills</Form.Label>
            <Form.Select
              id="skills"
              className="mb-3"
              value=""
              onChange={(e) => toggleSkill(e.target.value)}
            >
              <option value="">-- Select a skill --</option>
              {skillsToShow.map((skill) => (
                <option key={skill} value={skill}>
                  {splitCamelCase(skill)}
                </option>
              ))}
            </Form.Select>
          </>
        )}

        {/* SEARCH & RESET BUTTONS */}
        <div className="d-flex justify-content-between mb-3" style={{ marginTop: '25px' }}>
          <button type="button" className="btn btn-secondary" onClick={handleSearch}>
            Search
          </button>
          <button type="button" className="btn btn-warning btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        {/* FILTER BY SAVED: Saved Projects Toggle */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="savedSwitch"
            checked={showSavedOnly}
            onChange={() => setShowSavedOnly(!showSavedOnly)}
            style={{ width: "3rem", height: "1.2rem", marginRight: "10px" }}
          />
          <label className="form-check-label" htmlFor="savedSwitch">
            Filter by Saved Projects
          </label>
        </div>
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

       {/* SELECTED SKILLS AS REMOVABLE BADGES */}
        {selectedSkillsArray.length > 0 && (
          <div className="mb-4 d-flex flex-wrap" style={{ gap: "6px" }}>
            <strong style={{ marginRight: "8px" }}>Selected Skills:</strong>
            {selectedSkillsArray.map((skill) => (
              <span
                key={skill}
                className="badge"
                style={{
                  backgroundColor: "#6c757d", // dark gray
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
                onClick={() => removeSkill(skill)}
              >
                {splitCamelCase(skill)} ×
              </span>
            ))}
          </div>
        )}

        <Row className="g-4">
          {filtered.length === 0 && <p>No projects match the current filters.</p>}
          {filtered.map((item) => (
            item.project.duedate >= now.toISOString() && (
            <ProjectCard key={item.project.id} project={item.project} />
            )
          ))}
        </Row>

        <Row className="g-4 pt-4">
          <h3>Overdue Projects</h3>
          {filtered.map((item) => (
            item.project.duedate < now.toISOString() && (
            <ProjectCard key={item.project.id} project={item.project} />
            )
          ))}
        </Row>
      </Col>
    </Row>
  );
}
