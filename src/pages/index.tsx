import React from "react";
import Link from "next/link";

import me from "../../data/me";

import SEO from "../components/Seo";
import Links from "../components/Links";
import Greeting from "../components/Greeting";
import Ghost from "../components/Ghost";

const HomePage = () => (
  <div className="home">
    <SEO pageTitle="Home" keywords={me.keywords} />;
    <Ghost />
    <header>
      <Links links={me.links} />
    </header>
    <article>
      <Greeting descriptions={me.descriptions} />
    </article>
    <footer>
      <Link className="my__projects" href="/projects">
        Projects
      </Link>
      <Link className="my__resume" href="/resume">
        Resume
      </Link>
    </footer>
  </div>
);

export default HomePage;
