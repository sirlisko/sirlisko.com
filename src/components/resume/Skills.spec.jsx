import React from "react";
import renderer from "react-test-renderer";

import Skills from "./Skills.jsx";

describe("Skills Component", () => {
  let wrapper;
  const props = {
    skills: {
      main: ["foo", "bar"],
      "misc.": ["foobar"],
    },
  };

  beforeEach(() => {
    wrapper = renderer.create(<Skills {...props} />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
