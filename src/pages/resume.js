import React from "react";

import resume from "../../data/resume.json";

import "normalize.css";
import "../styles/resume.scss";

import SEO from "../components/seo";
import Me from "../components/resume/Me";
import Skills from "../components/resume/Skills";
import Education from "../components/resume/Education";
import Extras from "../components/resume/Extras";
import Contacts from "../components/resume/Contacts";
import Projects from "../components/resume/Projects";
import Experiences from "../components/resume/Experiences";
import Interests from "../components/resume/Interests";

export default () => (
  <>
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
      <Contacts />
    </div>
  </>
);
