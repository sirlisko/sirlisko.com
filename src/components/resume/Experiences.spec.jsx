import React from "react";
import renderer from "react-test-renderer";

import Experiences from "./Experiences.jsx";

describe("Experiences Component", () => {
  let wrapper;
  const props = {
    experiences: [
      {
        role: "foo",
        blurp: ["..."],
      },
      {
        role: "foo",
        where: "bar",
        when: "May 2000 - July 2001",
        blurp: ["foo", "bar", "foobar"],
      },
    ],
  };

  beforeEach(() => {
    wrapper = renderer.create(<Experiences {...props} />).toJSON();
  });

  it("should render properly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
