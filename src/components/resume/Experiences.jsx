import React from "react";

const Experiences = ({ experiences }) => (
  <article className="section experiences">
    <h1>Experiences</h1>
    {experiences.map(exp => (
      <div key={exp.where || exp.role}>
        <h2>
          {exp.role} {exp.where && <span>@ {exp.where}</span>}
        </h2>
        {exp.when && <h4>{exp.when}</h4>}
        {exp.blurp.map((blr, i) => (
          <p key={i}>{blr}</p>
        ))}
      </div>
    ))}
  </article>
);

export default Experiences;
