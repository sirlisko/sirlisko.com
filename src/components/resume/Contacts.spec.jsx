import React from "react";
import renderer from "react-test-renderer";

import Contacts from "./Contacts.jsx";

describe("Contacts Component", () => {
  let wrapper;

  it("should render properly", () => {
    wrapper = renderer.create(<Contacts />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render properly the alt version", () => {
    wrapper = renderer.create(<Contacts isAltVersion />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});
