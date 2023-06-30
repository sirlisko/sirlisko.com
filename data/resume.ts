import { Resume } from "../src/types";

const resume: Resume = {
  skills: {
    main: [
      "Javascript",
      "React",
      "Node",
      "Markup/CSS",
      "Front End Architecture",
      "FE Build & CI",
      "BDD/TDD",
      "Functional Testing",
    ],
    "misc.": [
      "Agile / Scrum",
      "Redux",
      "GraphQL",
      "Typescript",
      "Styled-Components",
      "Webpack",
      "NextJS",
      "Gatsby",
      "JAM stack",
      "Gulp / Grunt",
      "Chrome Extensions",
      "Bash Scripting",
      "User Scripting",
      "Web Scraping",
    ],
  },
  experiences: [
    {
      where: "YLD",
      when: "05.21 - now",
      blurp: [
        "Working on a NextJS application involving proxing and data meshing from multiple 3rd party APIs.",
        "Standardised the code, improved accessibility, and test stack.",
      ],
    },
    {
      where: "Hackney Council",
      when: "10.20-05.21 / 04.20-07.20 / 11.19-12.19",
      blurp: [
        "Developed various new services, using React/NextJS, lambda functions and deployed to AWS.",
        "Contributed to internal Component Libraries, knowledge sharing and mentored junior devs.",
        "Refactored the main Hackney website using JAM stack (Gatsby, WP, Netlify), introducing React best practices, Unit and E2E tests. Improved CI/CD.",
      ],
    },
    {
      where: "uSwitch / RVU",
      when: "01.20 - 03.20",
      blurp: [
        "Worked on internal tools using React/Redux-Saga, improving code quality and User Experience.",
        "Contributed to the internal UI/component library.",
      ],
    },
    {
      where: "Architecture Consultant",
      when: "09.19 - 11.19",
      blurp: [
        "Bootstrapped a brand new project based on a NextJS (Typescript) with Apollo (FE/BE) and a GraphQL Gateway, consuming REST API (internal and 3rd party) plus WordPress data via WP-GraphQL.",
      ],
    },
    {
      where: "Kalo",
      when: "04.19 - 06.19",
      blurp: [
        "Analysed, standardized and improved the whole Front End, with a main focus on the common UI library.",
        "Architected and created an MVP for a FE Monorepo.",
        "Improving performances and the Dev experience.",
      ],
    },
    {
      where: "Reason",
      when: "09.18 - 12.18",
      blurp: [
        "Developed from scratch a new service for a Clinet. Worked with React/Redux, Jest for testing, Storybook for documentation, Node for API proxy.",
      ],
    },
    {
      role: "Senior Frontend Engineer",
      where: "Verve",
      when: "05.17 - 07.18",
      blurp: [
        "Worked on improving the user experience through the check-out with technologies involving React/Redux, Relay, and GraphQL.",
        "Integrated 3rd party payment methods (Stripe).",
        "Worked with the design team to improve the UI/UX.",
      ],
    },
    {
      where: "In the past...",
      blurp: [
        "I had the pleasure to work for Shazam (~5years), YOOX Net-a-Porter (>1year), Pobble (>1year), for a detailed list of my past experiences check my Linkedin profile :)",
      ],
    },
  ],
  projects: [
    {
      name: "Been",
      url: "https://been.netlify.com/",
      blurp: [
        "Web companion to keep track of where you have BEEN, listing your visited countries.",
        "React app, with auth and databased powered by Firebase. Styled using Styled-Components. And a handcrafted World Map SVG.",
        "The project is still Work in Progress :)",
      ],
    },
    {
      name: "GigPlaylist",
      url: "https://gigplaylist.sirlisko.com/",
      blurp: [
        "Little webapp that shows you the most played songs by an artist in the last two years of gigs.",
        "Node.js app that proxies external APIs (Setlist.fm, Spotify and Songkick), mashes them up and create a Spotify playlist to set you up for your next Gig.",
      ],
    },
  ],
};

export default resume;
