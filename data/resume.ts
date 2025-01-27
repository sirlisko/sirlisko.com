import type { Resume } from "../src/types";

const resume: Resume = {
  skills: {
    main: [
      "Javascript",
      "Typescript",
      "React",
      "Node",
      "NextJS",
      "Markup/CSS",
      "Full Stack Architecture",
      "CI & CD",
      "GitHub Actions",
      "BDD/TDD",
      "Functional Testing",
    ],
    "misc.": [
      "Agile / Scrum",
      "Redux",
      "GraphQL",
      "Styled-Components",
      "Webpack",
      "Gatsby",
      "Astro",
      "JAM stack",
      "Chrome Extensions",
      "Bash Scripting",
      "User Scripting",
      "Web Scraping",
    ],
  },
  experiences: [
    {
      where: "YLD",
      when: "05.21 - 10.24",
      blurp: [
        "Developing a NextJS application, orchestrating and maintaining a RESTful service for seamless data integration from various sources.",
        "Standardised and modernised codebase, enhancing accessibility, and fortified the test stack.",
        "Building pipelines with GitHub Actions and deploying to Azure for seamless CI/CD.",
      ],
    },
    {
      where: "Hackney Council",
      when: "Multiple gigs (11.19 ~ 05.21)",
      blurp: [
        "Developed new services utilizing React/NextJS, lambda functions deployed on AWS.",
        "Contributed to internal Component Libraries, mentored junior developers, and shared knowledge.",
        "Revamped the Hackney website using JAM stack (Gatsby, WP, Netlify), emphasizing React best practices and implementing robust testing strategies. Improved CI/CD.",
      ],
    },
    {
      where: "uSwitch / RVU",
      when: "01.20 - 03.20",
      blurp: [
        "Enhanced internal tools using React/Redux-Saga, elevating code quality and User Experience.",
        "Contributed to the internal UI/component library.",
      ],
    },
    {
      where: "Architecture Consultant",
      when: "09.19 - 11.19",
      blurp: [
        "Initiated a NextJS (Typescript) project with Apollo (FE/BE) and GraphQL Gateway, integrating REST API (internal and 3rd party) alongside WordPress data.",
      ],
    },
    {
      where: "Kalo",
      when: "04.19 - 06.19",
      blurp: [
        "Overhauled Front End, focusing on a common UI library, and architected a FE Monorepo.",
        "Optimized performance and Dev experience.",
      ],
    },
    {
      where: "Reason",
      when: "09.18 - 12.18",
      blurp: [
        "Developed from scratch a new service for a client utilizing React/Redux and Node for API proxy.",
      ],
    },
    {
      role: "Senior Frontend Engineer",
      where: "Verve",
      when: "05.17 - 07.18",
      blurp: [
        "Enhanced check-out experience with React/Redux, Relay, GraphQL, and integrated 3rd party payment methods (Stripe and Braintree).",
        "Contributed to the internal component library and improved testing strategies.",
        "Worked with the design team to improve the UI/UX.",
      ],
    },
    {
      where: "Previous experiences:",
      blurp: [
        "Shazam (~5 years), YOOX Net-a-Porter (>1 year), Pobble (>1 year). Full details on LinkedIn.",
      ],
    },
  ],
  projects: [
    {
      name: "GigPlaylist",
      url: "https://gigplaylist.sirlisko.com/",
      blurp: [
        "Next.js app that proxies several APIs (Spotify, MusicBrainz, Songkick, etc.), combines their data to predict the most probable songs for a given artist's gig, and creates a Spotify playlist for you using Spotify Auth.",
      ],
    },
  ],
};

export default resume;
