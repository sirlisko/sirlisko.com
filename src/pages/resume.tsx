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
      <Me />
      <div className="wrapper">
        <Skills skills={resume.skills} />
        <Experiences experiences={resume.experiences} />
        <article className="section ouat">
          <h1>Once upon a time...</h1>I had the pleasure to work also with Java,
          Scala, PHP, MySQL, C++, Ruby on Rails. I don&#39;t consider myself an
          expert on those languages but I like, especially in my free time,
          playing with other technologies :)
        </article>
        <Projects projects={resume.projects} />
        <Education />
        <Extras />
        <Interests />
        <Contacts isAltVersion={isAltVersion} />
      </div>
    </div>
  );
};

export const Head = () => (
  <SEO
    pageTitle="Resume"
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
);

export default ResumePage;
