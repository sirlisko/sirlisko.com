import React from "react";
import renderer from "react-test-renderer";

import Me from "./Me.jsx";

describe("Me Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Me />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
