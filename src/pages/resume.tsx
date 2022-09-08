import React from "react";

import classNames from "classnames";
import resume from "../../data/resume";

import "../styles/style.scss";
import "../styles/resume.scss";

import SEO from "../components/Seo";
import Me from "../components/resume/Me";
import Skills from "../components/resume/Skills";
import Education from "../components/resume/Education";
import Extras from "../components/resume/Extras";
import Contacts from "../components/resume/Contacts";
import Projects from "../components/resume/Projects";
import Experiences from "../components/resume/Experiences";
import Interests from "../components/resume/Interests";

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
          "cv",
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
