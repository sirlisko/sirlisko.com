import React from "react";
import { Link } from "gatsby";

import "../styles/style.scss";
import "../styles/index.scss";

import me from "../../data/me.json";

import SEO from "../components/Seo.jsx";
import Links from "../components/Links.jsx";
import Greeting from "../components/Greeting.jsx";
import Ghost from "../components/Ghost.jsx";

const HomePage = () => (
  <div className="home">
    <SEO title="Home" keywords={me.keywords} />
    {typeof window !== `undefined` && !window.ontouchstart && <Ghost />}
    <header>
      <Links links={me.links} />
    </header>
    <article>
      <section className="greeting">
        <img
          className="greeting__face"
          src="./images/sirlisko.svg"
          alt="sirlisko face"
        />
        <Greeting descriptions={me.descriptions} />
      </section>
    </article>
    <footer>
      <Link className="my__projects" to="/projects">
        Projects
      </Link>
      <Link className="my__resume" to="/resume">
        Resume
      </Link>
    </footer>
  </div>
);

export default HomePage;
