import React from "react";
import Link from "next/link";

import { Resume } from "../../types";

interface ProjectProps {
  projects: Resume["projects"];
}

const Projects = ({ projects }: ProjectProps) => (
  <article className="section projects">
    <h1>Side Projects</h1>
    {projects.map((prj) => (
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
      <Link href="/projects">https://sirlisko.com/projects</Link>.
    </div>
  </article>
);

export default Projects;
