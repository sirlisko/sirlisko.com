import React from "react";
import renderer from "react-test-renderer";

import Education from "./Education.jsx";

describe("Education Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Education />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
