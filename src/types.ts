import type { FC } from "react";

interface BaseProject {
  title: string;
  description: string[];
  links: {
    [type: string]: string;
  };
  tech: string[];
  isDeprecated?: boolean;
}

interface ProjectWithLogo extends BaseProject {
  logo: string;
}
interface ProjectWithIcon extends BaseProject {
  icon: FC;
}

export type Project = ProjectWithLogo | ProjectWithIcon;

interface Link {
  name: string;
  url: string;
  label: string;
}

export interface Me {
  keywords: string[];
  descriptions: string[];
  links: Link[];
}

interface Experience {
  where: string;
  blurp: string[];
  when?: string;
  role?: string;
}

interface Skills {
  main: string[];
  "misc.": string[];
}

interface ProjectShort {
  name: string;
  url: string;
  blurp: string[];
}

export interface Resume {
  skills: Skills;
  experiences: Experience[];
  projects: ProjectShort[];
}
