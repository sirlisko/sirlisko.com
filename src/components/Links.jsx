import React from "react";
import PropTypes from "prop-types";

import "./Links.scss";

const Links = ({ links }) => (
  <ul className="links">
    {links.map((link) => (
      <li key={link.name} className={`links--${link.name}`}>
        <a href={link.url}>
          <p className="caption">{link.label}</p>
        </a>
      </li>
    ))}
  </ul>
);

Links.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default Links;
