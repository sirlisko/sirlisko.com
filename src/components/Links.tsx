import React from "react";

import "./Links.scss";

interface LinksProps {
  links: Array<{
    name: string;
    url: string;
    label: string;
  }>;
}

const Links = ({ links }: LinksProps) => (
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

export default Links;
