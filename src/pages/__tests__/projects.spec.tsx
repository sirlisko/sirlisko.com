import React from "react";
import { render } from "@testing-library/react";
import { useStaticQuery } from "gatsby";

import Projects from "../projects";

jest.mock("../../../data/projects.ts", () => [
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

jest.mock("gatsby", () => ({
  useStaticQuery: jest.fn(),
  graphql: jest.fn(),
  Link: jest
    .fn()
    .mockImplementation(({ to, children }) => <a href={to}>{children}</a>),
}));
const mockedStaticQuery = useStaticQuery as jest.Mock;

beforeEach(() => {
  mockedStaticQuery.mockImplementationOnce(() => ({
    site: {
      siteMetadata: {
        title: `I am the title`,
      },
    },
  }));
});

describe("Projects Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Projects />);
    expect(asFragment()).toMatchSnapshot();
  });
});
