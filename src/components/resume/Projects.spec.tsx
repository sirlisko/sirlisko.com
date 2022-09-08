import React from "react";
import { render } from "@testing-library/react";

import Projects from "./Projects";

describe("Projects Component", () => {
  const props = {
    projects: [
      {
        name: "foo",
        blurp: ["bar", "foobar."],
        url: "https://foobar.me",
      },
      {
        name: "asd",
        blurp: ["asd", "qwe."],
        url: "https://asd.me",
      },
    ],
  };

  it("should render properly", () => {
    const { asFragment } = render(<Projects {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
