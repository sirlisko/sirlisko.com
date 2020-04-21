import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./Greeting.scss";

const Greeting = ({ descriptions }) => {
  const [selectedDescription, setSelectedDescription] = useState(
    descriptions[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPosition = Math.floor(Math.random() * descriptions.length);
      setSelectedDescription(descriptions[randomPosition]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="greeting__intro">
      <p>Ciao!</p>
      <p>I’m sirLisko,</p>
      <p>another f@$#&amp;n’</p>
      <p className="greeting__intro__desc">
        {descriptions.map((d) => (
          <span
            key={d}
            className={
              d === selectedDescription ? "greeting__intro--active" : ""
            }
          >
            {d}
          </span>
        ))}
      </p>
    </div>
  );
};

Greeting.propTypes = {
  descriptions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Greeting;
