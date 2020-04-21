import React from "react";
import renderer from "react-test-renderer";

import Projects from "./Projects.jsx";

describe("Projects Component", () => {
  let wrapper;
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

  beforeEach(() => {
    wrapper = renderer.create(<Projects {...props} />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
