import React from "react";
import renderer from "react-test-renderer";

import Contacts from "./Contacts.jsx";

describe("Contacts Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = renderer.create(<Contacts />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
