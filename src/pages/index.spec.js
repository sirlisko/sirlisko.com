import React from "react";
import renderer from "react-test-renderer";
import { StaticQuery } from "gatsby";

import Index from "./index.js";

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

describe("Index Page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Index />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
