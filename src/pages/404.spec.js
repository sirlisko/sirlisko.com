import React from "react";
import renderer from "react-test-renderer";
import { StaticQuery } from "gatsby";

import Page404 from "./404.js";

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          title: `I am the title`
        }
      }
    })
  );
});

describe("404 Page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Page404 />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
