import React from "react";

import { Me } from "../types";

import styles from "./Links.module.scss";

interface LinksProps {
  links: Me["links"];
}

const Links = ({ links }: LinksProps) => (
  <ul className={styles.links}>
    {links.map((link) => (
      <li key={link.name} className={styles[link.name]}>
        <a href={link.url} title={link.name}>
          <span className={styles.caption}>{link.label}</span>
        </a>
      </li>
    ))}
  </ul>
);

export default Links;
