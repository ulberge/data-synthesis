import React from 'react';
import { render, waitForElement } from '../test-utils';
import Synthesis from './Synthesis';

test('renders Synthesis component', () => {
  const { container } = render(<Synthesis />);
  expect(container).toMatchSnapshot();
});
