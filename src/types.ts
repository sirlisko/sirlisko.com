export interface Project {
  title: string;
  description: string[];
  logo: string;
  links: {
    [type: string]: string;
  };
  tech: string[];
}

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
