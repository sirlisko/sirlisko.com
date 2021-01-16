import React from "react";
import { render } from "@testing-library/react";

import Education from "./Education.jsx";

describe("Education Component", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Education />);
    expect(asFragment()).toMatchSnapshot();
  });
});
