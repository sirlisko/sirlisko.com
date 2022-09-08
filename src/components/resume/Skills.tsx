import React from "react";
import { Resume } from "../../types";

interface SkillsProps {
  skills: Resume["skills"];
}

const Skills = ({ skills }: SkillsProps) => (
  <article className="skills">
    <h1>Skills</h1>
    {Object.keys(skills).map((type) => (
      <div key={type}>
        <h2>{type}</h2>
        <ul>
          {skills[type as keyof Resume["skills"]].map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    ))}
  </article>
);

export default Skills;
