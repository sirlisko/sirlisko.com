import React from "react";
import Image from "next/image";
import Link from "next/link";

import projects from "../../data/projects";

import SEO from "../components/Seo";
import ProjectCard from "../components/ProjectCard";

const ProjectsPage = () => (
  <div className="projects-page">
    <SEO
      pageTitle="Projects"
      description="What I am working on at the moment.. Give a look at my side projects."
      keywords={[
        "Luca Lischetti",
        "sirlisko",
        "web developer",
        "software engineer",
        "projects",
        "ideas",
      ]}
    />
    <div className="logo">
      <Link href="/">
        <Image
          src="/images/sirlisko.svg"
          alt="sirlisko face"
          height={144}
          width={100}
        />
      </Link>
    </div>
    <section>
      <h1>My Side Projects</h1>
      <ul>
        {projects.map((project) => (
          <li className="project" key={project.title}>
            <ProjectCard {...project} />
          </li>
        ))}
      </ul>
    </section>
  </div>
);

export default ProjectsPage;
