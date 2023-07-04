import React from "react";
import Image from "next/image";

import { Project } from "../types";

const ProjectCard = ({ title, description, logo, links, tech }: Project) => (
  <>
    <div className="project__main">
      <h3>{title}</h3>
      {description.map((desc) => (
        <p key={desc}>{desc}</p>
      ))}
    </div>
    <Image src={logo} alt={`${title} logo`} height={144} width={100} />
    <div className="project__details">
      <p className="project__details__links">
        {Object.keys(links).map((link) => (
          <a key={link} href={links[link]}>
            {link}
          </a>
        ))}
      </p>
      <ul className="project__details__tech">
        {tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  </>
);

export default ProjectCard;
