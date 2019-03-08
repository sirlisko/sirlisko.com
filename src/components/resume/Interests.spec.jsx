import React from "react";
import renderer from "react-test-renderer";

import Interests from "./Interests.jsx";

describe("Interests Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Interests />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
