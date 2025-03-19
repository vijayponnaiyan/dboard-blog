import React from "react";
import BlogDetail from "./BlogDetail";

describe("<BlogDetail />", () => {
  it("renders", () => {
    cy.mount(<BlogDetail />);
  });
});
