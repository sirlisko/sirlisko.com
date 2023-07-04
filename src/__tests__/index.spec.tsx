import React from "react";
import { render } from "@testing-library/react";

import Index from "../pages/index";

jest.mock("../../data/me.ts", () => ({
  descriptions: ["foo", "bar"],
  keywords: ["k_foo", "k_bar"],
  links: [
    { name: "foo", label: "Foo", url: "https://foo" },
    { name: "bar", label: "Bar", url: "https://Bar" },
  ],
}));

describe("Index Page", () => {
  it("should render properly", () => {
    const { asFragment } = render(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});
