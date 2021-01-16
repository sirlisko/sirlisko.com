import React from "react";
import { render } from "@testing-library/react";
import { StaticQuery } from "gatsby";

import Projects from "./projects.jsx";

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          title: `I am the title`,
        },
      },
    })
  );
});

describe("Projects Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Projects />);
    expect(asFragment()).toMatchSnapshot();
  });
});
