import { render, screen } from '@testing-library/react';
import Loading from '../Loading';
import React from "react";

describe('Loading component', () => {
  it('should render loading bar', () => {
    render(<Loading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
