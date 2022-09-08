import React from "react";
import { Resume } from "../../types";

interface ExperiencesProps {
  experiences: Resume["experiences"];
}

const Experiences = ({ experiences }: ExperiencesProps) => (
  <article className="section experiences">
    <h1>Experiences</h1>
    {experiences.map((exp) => (
      <div key={exp.where || exp.role}>
        {exp.where && (
          <h2>
            {exp.where} {exp.when && <span>{exp.when}</span>}
          </h2>
        )}
        {exp.blurp.map((blr, i) => (
          <p key={i}>{blr}</p>
        ))}
      </div>
    ))}
  </article>
);

export default Experiences;
