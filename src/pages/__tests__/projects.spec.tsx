import React from "react";
import { render } from "@testing-library/react";
import { StaticQuery } from "gatsby";

import Projects from "../projects";

jest.mock("../../../data/projects.json", () => [
  {
    title: "Foo",
    description: ["line 1", "line 2"],
    logo: "https://sirlisko.com/logo",
    links: {
      website: "https://foo",
      github: "https://github.com/sirlisko/foo",
    },
    tech: ["foo", "Foo"],
  },
  {
    title: "Bar",
    description: ["line a", "line b"],
    logo: "https://sirlisko.com/logo",
    links: {
      website: "https://bar",
      github: "https://github.com/sirlisko/bar",
    },
    tech: ["bar", "Bar"],
  },
]);

const mockedStaticQuery = StaticQuery as jest.Mock;

beforeEach(() => {
  mockedStaticQuery.mockImplementationOnce(({ render }) =>
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
