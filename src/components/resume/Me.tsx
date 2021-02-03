import React from "react";
import { Link } from "gatsby";

const Education = () => (
  <section className="me">
    <div className="me__face">
      <Link to="/">
        <img
          src="https://sirlisko.com/images/sirlisko.svg"
          alt="sirlisko face"
        />
      </Link>
    </div>
    <p className="me__intro">
      <span>Luca Lischetti</span>
      <span>a.k.a. sirLisko</span>
      <span>Senior Software Engineer</span>
    </p>
  </section>
);

export default Education;
