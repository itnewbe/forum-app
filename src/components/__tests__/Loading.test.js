import { render, screen } from "@testing-library/react";
import Loading from "../Loading";
import React from "react";

describe("Loading component", () => {
  it("should render loading bar with role progressbar", () => {
    render(<Loading />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { container } = render(<Loading />);
    expect(container).toMatchSnapshot();
  });
});
