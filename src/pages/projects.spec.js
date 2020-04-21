import React from "react";
import renderer from "react-test-renderer";
import { StaticQuery } from "gatsby";

import Projects from "./projects.js";

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
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Projects />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
