import React from "react";

interface SkillsProps {
  skills: {
    [type: string]: string[];
  };
}

const Skills = ({ skills }: SkillsProps) => (
  <article className="skills">
    <h1>Skills</h1>
    {Object.keys(skills).map((type) => (
      <div key={type}>
        <h2>{type}</h2>
        <ul>
          {skills[type].map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    ))}
  </article>
);

export default Skills;
