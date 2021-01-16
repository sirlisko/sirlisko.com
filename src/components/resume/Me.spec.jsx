import React from "react";
import { render } from "@testing-library/react";

import Me from "./Me.jsx";

describe("Me Component", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Me />);
    expect(asFragment()).toMatchSnapshot();
  });
});
