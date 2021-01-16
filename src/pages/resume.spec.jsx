import React from "react";
import { render } from "@testing-library/react";
import { StaticQuery } from "gatsby";

import Resume from "./resume.jsx";

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

describe("Resume Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Resume />);
    expect(asFragment()).toMatchSnapshot();
  });
});
