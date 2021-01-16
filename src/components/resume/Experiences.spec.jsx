import React from "react";
import { render } from "@testing-library/react";

import Experiences from "./Experiences.jsx";

describe("Experiences Component", () => {
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

  it("should render properly", () => {
    const { asFragment } = render(<Experiences {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
