import React from "react";

import classNames from "classnames";
import resume from "../../data/resume.json";

import "./resume.scss";

import SEO from "../components/Seo.jsx";
import Me from "../components/resume/Me.jsx";
import Skills from "../components/resume/Skills.jsx";
import Education from "../components/resume/Education.jsx";
import Extras from "../components/resume/Extras.jsx";
import Contacts from "../components/resume/Contacts.jsx";
import Projects from "../components/resume/Projects.jsx";
import Experiences from "../components/resume/Experiences.jsx";
import Interests from "../components/resume/Interests.jsx";

const ResumePage = () => {
  const isAltVersion =
    typeof window !== `undefined` &&
    window.location.search.indexOf("alt") !== -1;
  return (
    <div className={classNames("resume", isAltVersion && "alt")}>
      <SEO
        title="Resume"
        description="Resume (or CV) of Luca Lischetti also know as sirLisko. Experiences, skills and interests."
        keywords={[
          "Luca Lischetti",
          "sirlisko",
          "web developer",
          "software engineer",
          "resume",
          "cv"
        ]}
      />
      <Me />
      <div className="wrapper">
        <Skills skills={resume.skills} />
        <Experiences experiences={resume.experiences} />
        <Projects projects={resume.projects} />
        <Education />
        <Extras />
        <Interests />
        <Contacts isAltVersion={isAltVersion} />
      </div>
    </div>
  );
};

export default ResumePage;
