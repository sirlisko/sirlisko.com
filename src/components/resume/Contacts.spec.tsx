import React from "react";
import { render } from "@testing-library/react";

import Contacts from "./Contacts";

describe("Contacts Component", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Contacts />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render properly the alt version", () => {
    const { asFragment } = render(<Contacts isAltVersion />);
    expect(asFragment()).toMatchSnapshot();
  });
});
