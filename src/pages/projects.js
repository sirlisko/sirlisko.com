import React from "react";
import { Link } from "gatsby";

import projects from "../../data/projects.json";

import "./projects.scss";

import SEO from "../components/seo";
import ProjectCard from "../components/ProjectCard";

export default () => (
  <div className="projects-page">
    <SEO
      title="Projects"
      description="What I am working on at the moment.. Give a look at my side projects."
      keywords={[
        "Luca Lischetti",
        "sirlisko",
        "web developer",
        "software engineer",
        "projects",
        "ideas"
      ]}
    />
    <div className="logo">
      <Link to="/">
        <img src="/images/sirlisko.svg" alt="sirlisko face" />
      </Link>
    </div>
    <section>
      <h1>My Side Projects</h1>
      <ul>
        {projects.map(project => (
          <li className="project" key={project.title}>
            <ProjectCard {...project} />
          </li>
        ))}
      </ul>
    </section>
  </div>
);
