import React from "react";
import renderer from "react-test-renderer";
import { StaticQuery } from "gatsby";

import Resume from "./resume.js";

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
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Resume />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
