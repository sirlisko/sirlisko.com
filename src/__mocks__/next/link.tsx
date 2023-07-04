import React, { ReactElement } from "react";

const MockedNextLink = ({ children, ...rest }: { children: ReactElement }) => (
  <a {...rest}>{children}</a>
);

export default MockedNextLink;
