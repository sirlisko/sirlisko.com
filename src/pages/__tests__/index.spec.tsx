import React from "react";
import { render } from "@testing-library/react";
import { useStaticQuery } from "gatsby";

import Index from "../index";

jest.mock("../../../data/me.ts", () => ({
  descriptions: ["foo", "bar"],
  keywords: ["k_foo", "k_bar"],
  links: [
    { name: "foo", label: "Foo", url: "https://foo" },
    { name: "bar", label: "Bar", url: "https://Bar" },
  ],
}));

jest.mock("gatsby", () => ({
  useStaticQuery: jest.fn(),
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  )),
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

describe("Index Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});
