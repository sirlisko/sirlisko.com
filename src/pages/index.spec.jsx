import React from "react";
import { render } from "@testing-library/react";
import { StaticQuery } from "gatsby";

import Index from "./index.jsx";

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

describe("Index Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});
