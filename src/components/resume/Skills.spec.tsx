import React from "react";
import { render } from "@testing-library/react";

import Skills from "./Skills";

describe("Skills Component", () => {
  const props = {
    skills: {
      main: ["foo", "bar"],
      "misc.": ["foobar"],
    },
  };

  it("should render properly", () => {
    const { asFragment } = render(<Skills {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
