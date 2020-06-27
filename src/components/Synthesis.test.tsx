import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import Synthesis from './Synthesis';

test('renders Synthesis component', () => {
  const { container } = render(<Synthesis />);
  expect(container).toMatchSnapshot();
});
