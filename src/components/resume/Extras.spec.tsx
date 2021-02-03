import React from "react";
import { render } from "@testing-library/react";

import Extras from "./Extras";

describe("Extras Component", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Extras />);
    expect(asFragment()).toMatchSnapshot();
  });
});
