import React from "react";
import { render } from "@testing-library/react";
import { useStaticQuery } from "gatsby";

import Page404 from "../404";

jest.mock("gatsby", () => ({
  useStaticQuery: jest.fn(),
  graphql: jest.fn(),
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

describe("404 Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Page404 />);
    expect(asFragment()).toMatchSnapshot();
  });
});
