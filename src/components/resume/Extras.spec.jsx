import React from "react";
import renderer from "react-test-renderer";

import Extras from "./Extras.jsx";

describe("Extras Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Extras />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
