import React from "react";
import PropTypes from "prop-types";

const ProjectCard = ({ title, description, logo, links, tech }) => (
  <>
    <div className="project__main">
      <h3>{title}</h3>
      {description.map(desc => (
        <p key={desc}>{desc}</p>
      ))}
    </div>
    <img src={logo} alt={`${title} logo`} />
    <div className="project__details">
      <p className="project__details__links">
        {Object.keys(links).map(link => (
          <a key={link} href={links[link]}>
            {link}
          </a>
        ))}
      </p>
      <ul className="project__details__tech">
        {tech.map(t => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  </>
);

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
  tech: PropTypes.array.isRequired
};

export default ProjectCard;
