import React from "react";
import PropTypes from "prop-types";

const Skills = ({ skills }) => (
  <article className="skills">
    <h1>Skills</h1>
    {Object.keys(skills).map(type => (
      <div key={type}>
        <h2>{type}</h2>
        <ul>
          {skills[type].map(skill => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    ))}
  </article>
);

Skills.propTypes = {
  skills: PropTypes.shape(PropTypes.array.isRequired).isRequired
};

export default Skills;
