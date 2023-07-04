import React from "react";
import { render } from "@testing-library/react";

import Page404 from "../pages/404";

describe("404 Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Page404 />);
    expect(asFragment()).toMatchSnapshot();
  });
});
