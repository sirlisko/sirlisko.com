import React from "react";
import { render } from "@testing-library/react";
import { StaticQuery } from "gatsby";

import Page404 from "../404";

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

describe("404 Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Page404 />);
    expect(asFragment()).toMatchSnapshot();
  });
});
