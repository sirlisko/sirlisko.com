import React from "react";
import { render } from "@testing-library/react";

import Me from "./Me";

describe("Me Component", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Me />);
    expect(asFragment()).toMatchSnapshot();
  });
});
