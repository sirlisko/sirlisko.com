import React from "react";
import PropTypes from "prop-types";

const Contacts = ({ isAltVersion }) => (
  <article className="section contacts">
    <h1>Contacts</h1>
    <p>
      My personal website{" "}
      <a href="https://sirlisko.com">https://sirlisko.com</a>
    </p>
    <p>
      My Github{" "}
      <a href="https://github.com/sirlisko">https://github.com/sirlisko</a>
    </p>
    <p>
      My LinkedIn{" "}
      <a href="https://www.linkedin.com/in/lucalischetti/">
        https://www.linkedin.com/in/lucalischetti/
      </a>
    </p>
    <p>
      Drop me an email at{" "}
      <a href="mailto:luca@sirlisko.com">luca@sirlisko.com</a>.
    </p>
    {!isAltVersion ? (
      <p>
        A print-friendly version of this:{" "}
        <a href="https://sirlisko.com/cv/alt.pdf">
          https://sirlisko.com/cv/alt.pdf
        </a>
      </p>
    ) : (
      <p>
        A live version of this resume:{" "}
        <a href="https://sirlisko.com/resume">https://sirlisko.com/resume</a>
      </p>
    )}
  </article>
);

Contacts.propTypes = {
  isAltVersion: PropTypes.bool,
};

export default Contacts;
