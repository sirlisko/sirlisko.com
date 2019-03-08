import React from "react";
import PropTypes from "prop-types";

const Links = ({ links }) => (
  <ul className="links">
    {links.map(link => (
      <li key={link.name} className={`links--${link.name}`}>
        <a href={link.url}>
          <p className="caption">{link.label}</p>
        </a>
      </li>
    ))}
  </ul>
);

export default Links;
