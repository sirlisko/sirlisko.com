import React from "react";

import { Me } from "../types";

import "./Links.scss";

interface LinksProps {
  links: Me["links"];
}

const Links = ({ links }: LinksProps) => (
  <ul className="links">
    {links.map((link) => (
      <li key={link.name} className={`links--${link.name}`}>
        <a href={link.url} title={link.name}>
          <p className="caption">{link.label}</p>
        </a>
      </li>
    ))}
  </ul>
);

export default Links;
