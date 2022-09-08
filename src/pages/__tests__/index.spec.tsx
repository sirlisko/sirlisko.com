import React from "react";
import { render } from "@testing-library/react";
import { StaticQuery } from "gatsby";

import Index from "../index";

jest.mock("../../../data/me.ts", () => ({
  descriptions: ["foo", "bar"],
  keywords: ["k_foo", "k_bar"],
  links: [
    { name: "foo", label: "Foo", url: "https://foo" },
    { name: "bar", label: "Bar", url: "https://Bar" },
  ],
}));

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

describe("Index Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});
