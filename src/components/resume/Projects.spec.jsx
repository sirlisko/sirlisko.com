import React from "react";
import { render } from "@testing-library/react";

import Projects from "./Projects.jsx";

describe("Projects Component", () => {
  const props = {
    projects: [
      {
        name: "foo",
        blurp: ["bar", "foobar."],
        logo: "imgs/foobar.png",
        links: {
          website: "https://foobar.me",
          github: "https://github.com/sirlisko/foobar",
        },
        tech: ["foo", "bar", "foobar"],
      },
      {
        name: "asd",
        blurp: ["asd", "qwe."],
        logo: "imgs/asd.png",
        links: {
          website: "https://asd.me",
          github: "https://github.com/sirlisko/asd",
        },
        tech: ["asd", "qwe", "foobar"],
      },
    ],
  };

  it("should render properly", () => {
    const { asFragment } = render(<Projects {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
