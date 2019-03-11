import React from "react";
import PropTypes from "prop-types";

const Projects = ({ projects }) => (
  <article className="section projects">
    <h1>Side Projects</h1>
    {projects.map(prj => (
      <div key={prj.name}>
        <h2>
          <a href={prj.url}>{prj.name}</a>
        </h2>
        {prj.blurp.map((blr, i) => (
          <p key={i}>{blr}</p>
        ))}
      </div>
    ))}
    <div>
      To see a full list of my side projects go to{" "}
      <a href="/projects">https://sirlisko.com/projects</a>.
    </div>
  </article>
);

Projects.propTypes = {
  projects: PropTypes.array.isRequired
};

export default Projects;
