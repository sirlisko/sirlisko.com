import React from "react";
import { render } from "@testing-library/react";

import Interests from "./Interests.jsx";

describe("Interests Component", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Interests />);
    expect(asFragment()).toMatchSnapshot();
  });
});
